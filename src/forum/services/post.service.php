<?php

require_once 'functions.php';
$con=db_connect();
if(isset($_POST['toggleFlag'])) {
    $postId = $_POST['postId'];
    $query = "UPDATE posts  SET flag=IF(flag='1',flag-1,flag+1) WHERE id='$postId'";
    mysqli_query($con, $query);
    $post=selectPost($postId);
    $postAuthorId=$post->authorId;
    $postAuthor=loadUser($postAuthorId);
    $post->author=$postAuthor;
    echo json_encode($post);
}
if(isset($_GET['loadFlags'])){
   $posts=loadFlags();
   $authors=getAuthors($con,$posts);
   $posts=postsResult($posts,$authors);
   echo json_encode($posts);
}
if(isset($_POST['createPost'])){
    $threadId=$_POST['threadId'];
    $authorId=$_POST['authorId'];
    $text=$_POST['text'];
    updateAccess($authorId);    //update last access
    $query="INSERT INTO posts (threadId, authorId, text ) VALUES ('$threadId','$authorId','$text')";
    $result=mysqli_query($con,$query);
    $last_id = $con->insert_id;    //id of a post
    incrementPostNumberOfThread($threadId);
    incrementForumPostNumber($threadId);
    setPostAsLastPostOfThread($last_id,$threadId);
    incrementUserPosts($authorId);
    $post=selectPost($last_id);
    $author=loadUser($authorId);
    $post->author=$author;
    $nav=getLastPageUrl($threadId);
    $result= new stdClass;
    $result->post=$post;
    $result->nav=$nav;
    echo json_encode($result);
}
if(isset($_POST['deletePost'])){
    $post=selectPost($_POST['postId']);
    $authorId=$post->authorId;
    deletePost($postId);
    decrementForumPostNumber($post->threadId);
    decrementThreadPostNumber($post->threadId);
    decrementUserPosts($authorId);
    updateAccess($authorId);
    echo json_encode($post);
}
if(isset($_POST['editPost'])){
        $post=json_decode($_POST['post'],true);
        $postText=$post['text'];
        $postId=$post['id'];
        //edit post
        $query="UPDATE posts SET text='$postText' WHERE id='$postId'";
        $r=mysqli_query($con,$query);
        $post=selectPost($postId);
        $authorId=$post->authorId;
        $author=loadUser($authorId);
        $post->author=$author;
        updateAccess($authorId);    //update last access
        echo json_encode($post);
}