<?php


function db_connect(){
    $connection =new mysqli('localhost', 'root', 'password', 'forum');
    if($connection->connect_error) {
        die($connection->connect_error);
    }
    return $connection;
}
$con=db_connect();
function selectParticipants($convIds){
    global $con;
    $query="SELECT*FROM participants WHERE";
    foreach ($convIds as $id){
        $query=$query." conversationId='$id' OR";
    }
    $query=substr($query,0,-3);
    $result=mysqli_query($con,$query);
    $participants=[];
    while ($row=mysqli_fetch_object($result)){
        array_push($participants,$row);
    }
    return $participants;
}
function attachAvatars($conversations,$participants){
    global $con;
    $userIds=[];
    foreach ($participants as $participant){
        array_push($userIds, $participant->userId);
    }
    $users=loadUsers($userIds,$con);

    foreach ($conversations as $conversation){
        $p=[];
        for($j=0;$j<count($participants);$j++){
            if($participants[$j]->conversationId==$conversation->id) {
                foreach ($users as $user){
                    if($user->id==$participants[$j]->userId){
                        array_push($p,$user->img);
                        break;
                    }
                }
            }
        }
        $conversation->avatars=$p;
    }
    return $conversations;
}
function selectWhereUserIsParticipant($userId){
    global $con;
    $convIds=[];
    $query="SELECT * FROM participants WHERE userId='$userId'";
    $result=mysqli_query($con,$query);
    while ($row=mysqli_fetch_assoc($result)) {
        $convId = $row['conversationId'];
        array_push($convIds, $convId);
    }
    return $convIds;
}
function selectConversations($ids){
    global $con;
    $conversations=[];
    $query="SELECT * FROM conversations WHERE ";
    foreach ($ids as $id){
        $query=$query."id='$id' OR ";
    }
    $query=substr($query, 0, -3);
    $result=mysqli_query($con,$query);
    while ($row=mysqli_fetch_object($result)) {
        array_push($conversations,$row);
    }
    return $conversations;

}
function insertConversation($authorId,$title){
    global $con;
    $query = "INSERT INTO conversations (authorId,title) VALUES ('$authorId','$title')";
    mysqli_query($con,$query);
    $conversationId=$con->insert_id;
    $query="SELECT * FROM conversations WHERE id='$conversationId'";
    $result=mysqli_query($con,$query);
    $conv=mysqli_fetch_object($result);
    return $conv;
}
function insertParticipants($participants, $conversationId){
    global $con;
    $query="INSERT INTO participants (conversationId,userId) VALUES";
    foreach ($participants as $participant){
        $id=$participant['id'];
        $query=$query."('$conversationId', '$id'),";
    }
    $query=substr($query, 0, -1);
    mysqli_query($con,$query);
}
function insertMessage($conversationId,$authorId,$text){
    global $con;
    $query="INSERT INTO messages (conversationId,authorId,text) VALUES ('$conversationId','$authorId','$text')";
    mysqli_query($con,$query);
    $messageId=$con->insert_id;
    return $messageId;
}
function getMessage($messageId){
    global $con;
    $query="SELECT*FROM messages WHERE id='$messageId'";
    $result=mysqli_query($con,$query);
    $message=mysqli_fetch_object($result);
    $message->author=loadUser($message->authorId);
    return $message;
}
function selectSeenMessages($userId){
    global $con;
    $seenMessageIds=[];
    $seenMessagesQuery="SELECT*FROM `seen-messages` WHERE userId='$userId'";
    $result=mysqli_query($con,$seenMessagesQuery);
    while ($row=mysqli_fetch_assoc($result)){ array_push($seenMessageIds,$row['seenMessageId']);}
    return $seenMessageIds;
}
function getAllMessagesForUser($userId){
    global $con;
    $convQuery= "SELECT * FROM  participants where userId='$userId'";
    $part=mysqli_query($con,$convQuery);
    //build message query
    $messageQuery="SELECT * FROM messages WHERE conversationId in (";
    while($c=mysqli_fetch_assoc($part)){
        $convId=$c['conversationId'];
        $messageQuery=$messageQuery." '$convId',";
    }
    //select all messages from conversations where this user is participant
    $messageQuery=substr($messageQuery,0,-1);$messageQuery=$messageQuery.")";
    //get messages where conversation id = conversation ids
    $result=mysqli_query($con,$messageQuery);
    $allMessagesForUser=array();
    while ($row=mysqli_fetch_assoc($result)){ array_push($allMessagesForUser,$row);}
    return $allMessagesForUser;
}
function filterOutSeenMessages($allMessagesForUser,$seenMessageIds,$userId){
    $finalMessagesArray=[];
    foreach ($allMessagesForUser as $message){
        $c=0;//checks if message has been seen
        foreach ($seenMessageIds as $id) {
            if($message['id']==$id) $c++; //if seen message == message for user
        }
        if($c==0 && $message['authorId']!=$userId ){ //if message author is not user requesting messages (he doesn't need his own messages)
            $author=loadUser($message['authorId']);
            $message=(object) $message;
            $message->author=$author;
            array_push($finalMessagesArray,$message);
        }
    }
    return $finalMessagesArray;
}
function getConversation($conversationId){
    global $con;
    $query="SELECT * FROM conversations WHERE id ='$conversationId'";
    $result=mysqli_query($con,$query);
    $conv=mysqli_fetch_object($result);
    $author=loadUser($conv->authorId);
    $conv->author=$author;
    $participants=selectParticipants([$conv->id]);
    $conv=attachAvatars([$conv],$participants);
    return $conv[0];
}
function getMessages($userId,$lastMessageId,$conversationId){
    global $con;
    if($lastMessageId) //you are inside conversation therefore, if there are new messages mark them as read
        $query = "SELECT * FROM messages WHERE conversationId = '$conversationId' AND id > '$lastMessageId'";
    else $query = "SELECT * FROM messages WHERE conversationId= '$conversationId' ";
    $result = mysqli_query($con, $query);
    $authorIds=[];
    $messages=[];
    while ($row=mysqli_fetch_object($result)){
        $id=$row->id;
        $authorId=$row->authorId;
        insertSeenMessage($userId,$id);
        array_push($authorIds,$authorId);
        array_push($messages,$row);
    }
    $authors=loadUsers($authorIds,$con);
    $messages=attachAuthors($messages,$authors);



    return $messages;
}
function insertSeenMessage($userId,$messageId){
    global $con;
    $query ="INSERT INTO `seen-messages` (userId , seenMessageId) VALUES ('$userId','$messageId')";
    mysqli_query($con,$query);
}
function countForumThreadsAndPosts($forumId){
    global $con;
    $query="SELECT * FROM forums WHERE id='$forumId'";
    $result=mysqli_query($con,$query);
    $thread=mysqli_fetch_object($result);
    $result=new stdClass;
    $result->postNumber=$thread->postNumber;
    $result->threadsNumber=$thread->threadsNumber;
    return $result;
}
function countUsers(){
    global $con;
    $query="SELECT COUNT(*) FROM users";
    $result=mysqli_query($con,$query);
    $result=mysqli_fetch_assoc($result);
    return $result['COUNT(*)'];
}
function getNewestUser(){
    global $con;
    $query="SELECT * FROM users ORDER BY id DESC LIMIT 1";
    $userResult=mysqli_query($con,$query);
    $newUser=mysqli_fetch_object($userResult);
    return $newUser;
}
function createStats($sumThreads,$sumPosts,$nUsers,$newUser){
    $stats=new stdClass();
    $stats->threads=$sumThreads;
    $stats->posts=$sumPosts;
    $stats->users=$nUsers;
    $stats->newestUser=$newUser;
    return $stats;
}
function incrementForumPostNumber($threadId){
    global $con;
    $thread=loadThread($threadId,$con);
    $forumId=$thread->forumId;
    $query="UPDATE forums SET postNumber=postNumber+1 WHERE id='$forumId'";
    mysqli_query($con,$query);
}
function decrementForumPostNumber($threadId){
    global $con;
    $thread=loadThread($threadId,$con);
    $forumId=$thread->forumId;
    $query="UPDATE forums SET postNumber=postNumber-1 WHERE id='$forumId'";
    mysqli_query($con,$query);
}
function decrementThreadPostNumber($threadId){
    global $con;
    $query="UPDATE threads SET postNumber=postNumber-1 WHERE id='$threadId'";
    mysqli_query($con,$query);
}
function getLastPageUrl($threadId){

    $con=db_connect();
    $query="SELECT * FROM threads WHERE id='$threadId'";
    $result=mysqli_query($con,$query);
    $thread=mysqli_fetch_assoc($result);

    $url='./forum/'.$thread['forumId'].'/thread/'.$thread['id'];
    $page=intdiv($thread['postNumber'],20)+1;

    $nav=new stdClass;
    $nav->url=$url;
    $nav->page=$page;
    return $nav;
}
function incrementPostNumberOfThread($threadId){
    $con=db_connect();
    //increment post number of a thread
    $query2="UPDATE threads SET postNumber=postNumber+1 WHERE id='$threadId'";
    mysqli_query($con,$query2);
}
function incrementForumThreadNumber($forumId){
    $con=db_connect();
    //increment number of threads in a forum
    $query="UPDATE forums set threadsNumber=threadsNumber+1 WHERE id='$forumId'";
    mysqli_query($con,$query);
}
function decrementForumThreadNumber($forumId){
    global $con;
    $query="UPDATE forums set threadsNumber=threadsNumber-1 WHERE id='$forumId'";
    mysqli_query($con,$query);
}
function setPostAsLastPostOfThread($last_id,$threadId){
    global $con;
    $query3 = "UPDATE threads SET lastPostId='$last_id' WHERE id='$threadId'";
    mysqli_query($con,$query3);
}
function incrementUserPosts($userId){
    global $con;
    //increment users number of posts
    $query="UPDATE users SET numPosts=numPosts+1 WHERE id='$userId'";
    mysqli_query($con,$query);
}
function decrementUserPosts($userId){
    global $con;
    //decrement users number of posts
    $query="UPDATE users SET numPosts=numPosts-1 WHERE id='$userId'";
    mysqli_query($con,$query);
}
function generateToken(){
    $token=null;
    $con=db_connect();
    $row=null;
    do{
        $token=rand(0,10000);
        $query="SELECT*FROM users WHERE token='$token'";
        $result=mysqli_query($con,$query);
        $row = mysqli_fetch_assoc($result);
    }while($row);
    return $token;
}
function incrementThreadViews($threadId){
    $con=db_connect();
    $query="UPDATE threads SET views=views+1 WHERE id='$threadId'";
    mysqli_query($con,$query);
}
function updateAccess($userId){
    //update last seen
    $con=db_connect();
    $query="UPDATE users SET lastAccess=CURRENT_TIMESTAMP WHERE id='$userId'";
    mysqli_query($con,$query);
}
function loadPosts($threadId,$offset,$con){
    $query="SELECT * FROM posts where threadId='$threadId' LIMIT 20 OFFSET $offset";
    $result=mysqli_query($con,$query);
    $posts=[];
    while ($row = mysqli_fetch_object($result)) {
        array_push($posts,$row);
    }
    return $posts;
}
function selectLast5Threads(){
    global $con;
    $query="SELECT*FROM threads ORDER BY id DESC LIMIT 5";
    $result=mysqli_query($con,$query);
    $threads=[];
    while ($row=mysqli_fetch_object($result)){
        array_push($threads,$row);
    }
    $authors=getAuthors($con,$threads);
    $threads=attachAuthors($threads,$authors);
    return $threads;
}
function selectThreads($forumId, $offset){
    global $con;
    $query="SELECT* FROM threads WHERE forumId='$forumId' LIMIT 20 OFFSET $offset";
    $result=mysqli_query($con,$query);
    $threads=[];
    while ($row=mysqli_fetch_object($result)){
        //thread page number
        $page=(int)($row->postNumber/20)+1;
        $row->pageNumber=$page;

        array_push($threads,$row);
    }
    return $threads;
}
function getLastPostsOfThreads($threads){
    global $con;
    $query="SELECT * FROM posts WHERE";
    foreach ($threads as $thread){
        $lastPostId=$thread->lastPostId;
        $query=$query. " id='$lastPostId' OR";
    }
    $query=substr($query,0,-3);
    $result=mysqli_query($con,$query);
    $i=0;
    while ($row=mysqli_fetch_object($result)){
       // $threads[$i]->lastPost=$row;
        foreach ($threads as $thread){
            if($thread->id==$row->threadId){
                $thread->lastPost=$row;
                break;
            }
        }
        $i++;
    }
    return $threads;
}
function attachAuthors($entities,$authors){
    foreach ($entities as $entity){
        $user='';
        for($j=0;$j<count($authors);$j++){
            if($authors[$j]->id==$entity->authorId){
                $user=$authors[$j];
                break;
            }
        }
        $entity->author=$user;
    }
    return $entities;
}
function getForum($forumId){
    global $con;
    $query="SELECT*FROM forums WHERE id='$forumId'";
    $result=mysqli_query($con,$query);
    $forum=mysqli_fetch_object($result);
    return $forum;
}
function loadThreads($forumId,$offset){
    global $con;
    $threads=selectThreads($forumId,$offset);
    $authors=getAuthors($con,$threads);
    $threads=attachAuthors($threads,$authors);
    $threads=getLastPostsOfThreads($threads);
    return $threads;
}
function loadThread($threadId,$con){
    //get thread
    $query3="SELECT * FROM threads WHERE id='$threadId'";
    $r3=mysqli_query($con,$query3);
    $thread=mysqli_fetch_object($r3);
    return $thread;
}
function loadUsers($userIds,$con){
    $users=[];
    $userQuery="SELECT*FROM users WHERE ";
    foreach ($userIds as $id){$userQuery=$userQuery."id='$id' OR ";}
    $userQuery=substr($userQuery,0,-3);
    $result=mysqli_query($con,$userQuery);
    while ($row = mysqli_fetch_object($result)) {array_push($users,$row);}
    return $users;
}
function loadUser($id){
    global $con;
    $userQuery="SELECT*FROM users WHERE id='$id'";
    $result=mysqli_query($con,$userQuery);
    $user = mysqli_fetch_object($result);
    return $user;
}
function getAuthors($con,$entities){    //get user ids for post,thread or conversation authors
    $userIds=[];
    foreach ($entities as $entity){
        array_push($userIds,$entity->authorId);
    }
    $users=loadUsers($userIds,$con);
    return $users;
}
function postsResult($posts,$users){
    $result=[];
    $i=0;
    foreach ($posts as $post){//get post author
        $user='';
        for($j = 0; $j < count($users); $j++) {
            if($users[$j]->id == $post->authorId) {
                $user= $users[$j];
                break;
            }
        }
        $post->author=$user;
        array_push($result,$post);
        $i++;
    }
    return $result;
}
function threadResult($threadId,$con){
    $thread=loadThread($threadId,$con);
    $user=loadUser($thread->authorId);
    //get thread's last post
    $lastPostId=$thread->lastPostId;
    $queryPost="SELECT * FROM posts WHERE id='$lastPostId'";
    $res=mysqli_query($con,$queryPost);
    $post=mysqli_fetch_object($res);
    $lastPostAuthor=loadUser($post->authorId);
    $post->author=$lastPostAuthor;
    $thread->lastPost=$post;
    $thread->pageNumber=intdiv($thread->postNumber,20)+1;
    $thread->author=$user;
    return $thread;
}
function deleteThreadAndPosts($thread,$con){
    $threadId=$thread->id;
    $forumId=$thread->forumId;
    //delete all posts from this thread
    $query="DELETE FROM posts WHERE threadId='$threadId'";
    mysqli_query($con,$query);
    $query="DELETE FROM threads WHERE id='$threadId'";//delete thread
    mysqli_query($con,$query);
    //decrement forum post number by number of posts in thread
    $postNumber=$thread->postNumber;
    $query="UPDATE forums SET postNumber=postNumber-'$postNumber' WHERE id='$forumId'";
    mysqli_query($con,$query);
    decrementForumThreadNumber($forumId);
}
function loadThreadResult($page,$thread,$posts){
    $result=new stdClass;
    $result->page=$page+1;
    $result->thread=$thread;
    $result->posts=$posts;
    return $result;
}
function loadUserT($token,$con){
    $query="SELECT * FROM users WHERE  token='$token'";
    $result=mysqli_query($con,$query);
    $user=mysqli_fetch_object($result);
    return $user;
}
function selectPost($id){
    global $con;
    $query = "SELECT * FROM posts WHERE id='$id'";
    $result = mysqli_query($con, $query);
    $post = mysqli_fetch_object($result);
    return $post;
}
function loadFlags(){
    global $con;
    $posts=[];
    $query="SELECT * FROM posts WHERE flag='1'";
    $result=mysqli_query($con,$query);
    while ($row=mysqli_fetch_object($result)){
        array_push($posts,$row);
    }
    return $posts;
}
function deletePost($id){
    global $con;
    $query="DELETE FROM posts WHERE id='$id'";
    mysqli_query($con,$query);
}
