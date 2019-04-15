<?php

require_once 'functions.php';
$con=db_connect();
//edit user profile
if(isset($_POST['edit'])){
    if(isset($_FILES['avatar'])) {
        $file_name=$_FILES['avatar']['name'];
        $file_tmp = $_FILES['avatar']['tmp_name'];
        $uploadFile='../../assets/'.basename($file_name);
        move_uploaded_file($file_tmp,$uploadFile);
    }
    $token=$_POST['token'];
    $username=$_POST['username'];
    $password=$_POST['password'];
    $img=$_POST['img'];
    $email=$_POST['email'];
    $signature=$_POST['signature'];
    $query="UPDATE users SET username='$username', password='$password', email='$email', img='$img', signature='$signature' WHERE token='$token' ";
    mysqli_query($con,$query);
    $user=loadUserT($token,$con);
    echo json_encode($user);
}
if(isset($_POST['unbanUsers'])){
    $userIds=$_POST['userIds'];
    $userIds=explode(',',$userIds);
    foreach ($userIds as $userId){
        $query="UPDATE users SET ban = null where id='$userId'";
        mysqli_query($con,$query);
    }
}
if(isset($_POST['banUsers'])){
    $userIds=$_POST['userIds'];
    $userIds=explode(',',$userIds);
    $expirationDate=$_POST['time'];
        foreach ($userIds as $userId){
            $query="UPDATE users set ban='$expirationDate' where id='$userId'";
            mysqli_query($con,$query);
            $e=(string)$userId;
            $q="CREATE EVENT e ON SCHEDULE AT '$expirationDate' DO UPDATE users SET ban = NULL WHERE id='$userId'";
            mysqli_query($con,$q);
        }
}
if(isset($_POST['deleteUsers'])){
    $userIds=$_POST['userIds'];
    $userIds=explode(",",$userIds);
    foreach ($userIds as $userId){
        $query="DELETE  FROM users where id='$userId'";
        mysqli_query($con,$query);
            $query="DELETE FROM threads where authorId='$userId' ";
            mysqli_query($con,$query);
            $query="DELETE FROM posts where authorId='$userId'";
            mysqli_query($con,$query);
            $query="DELETE FROM conversations where authorId='$userId'";
            mysqli_query($con,$query);
            $query="DELETE FROM messages where authorId='$userId'";
            mysqli_query($con,$query);
    }


}
if(isset($_GET['loadUsers'])){
    $users=loadUsers([],$con);
    echo json_encode($users);
}
//check if user allowed in conversation
if(isset($_GET['checkConversation'])){
    $userToken=$_GET['userToken'];
    $convId=$_GET['conversationId'];
    $participantIds=array();
    $query="SELECT * FROM participants WHERE conversationId='$convId'";
    $result=mysqli_query($con,$query);
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($participantIds, $row['userId']);
    }
    $user=loadUserT($userToken,$con);
    $userId=$user->id;
    if(in_array($userId,$participantIds)){
        echo 'true';
    }else echo 'false';
}
if(isset($_POST['login'])){
        $email=$_POST['email'];
        $username=$_POST['username'];
        $password=$_POST['password'];
        array_push($loggedInArray,$username);
        $query= "SELECT * FROM users where email='$email' AND password='$password'";
        $result=mysqli_query($con,$query);
        $row = mysqli_fetch_assoc($result);
        //update last access
        $userId=$row['id'];
        updateAccess($userId);
        if($row){
            $encodedResult=json_encode($row);
            echo $encodedResult;
        }
}
if(isset($_POST['loadRecentUsers'])){
   //get all users last seen 10 minutes ago
    $users=array();
    $query="SELECT * FROM users WHERE lastAccess >= (NOW() - INTERVAL 10 MINUTE)";
    $res=mysqli_query($con,$query);
   while ($row=mysqli_fetch_assoc($res)){
       array_push($users,$row);
   }
   $encodedResult=json_encode($users);
   echo $encodedResult;

}
if(isset($_POST['signup'])){
    $email=$_POST['email'];
    $username=$_POST['username'];
    $password=$_POST['password'];
    //check if email was used
    $query= "SELECT * FROM users where email='$email'";
    $result=mysqli_query($con,$query);
    $row = mysqli_fetch_assoc($result);
    if($row){
        //there is an account with this email already
        echo json_encode(null);
    }else{
        //generate token
        $token=generateToken();
        //insert user into database
        $query="INSERT INTO users (username,email,password,token) VALUES ('$username','$email','$password','$token')";
        $result=mysqli_query($con,$query);
        $last_id = $con->insert_id;
        $user=loadUser($last_id);
        //update last access
        $userId=$user->id;
        updateAccess($userId);
        echo json_encode($user);
    }

}
if(isset($_POST['keep'])){
    $token=$_POST['token'];
    $user=loadUserT($token,$con);
    if($user)
       echo json_encode($user);
}
if(isset($_POST['loadUser'])){
    $id=$_POST['userId'];
    $user=loadUser($id);
    if($user)
        echo json_encode($user);
}
if(isset($_GET['loadSearchUsers'])){
    $str=$_GET['string'];
    $users=array();
    if($str!='') {
        $query = "SELECT * FROM users where username LIKE '%$str%'";
        $result = mysqli_query($con, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($users, $row);
        }
        echo json_encode($users);
    }
}



















