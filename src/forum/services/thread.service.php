<?php
require_once 'functions.php';
$con = db_connect();


//check if thread is locked
if(isset($_GET['checkLock'])){
    $threadId=$_GET['threadId'];
    $thread=loadThread($threadId,$con);
    $locked=$thread->locked;
    if($locked=='1') echo '1';
    else echo '0';
}
//delete thread
if(isset($_GET['deleteThread'])){
    $threadId=$_GET['threadId'];
    $thread=threadResult($threadId,$con);
    deleteThreadAndPosts($thread,$con);
    echo json_encode($thread);
}
//lock/unlock thread
if(isset($_GET['lock'])||isset($_GET['unlock'])){
    $action=null;
    if(isset($_GET['lock'])) $action=1; else $action=0;//determine if we should lock or unlock
    $threadId=$_GET['threadId'];
    $query="UPDATE threads set locked='$action' WHERE id='$threadId'";
    mysqli_query($con,$query);
    $thread=threadResult($threadId,$con);
    echo json_encode($thread);
}
//load posts
if(isset($_GET['loadThread'])){
        $threadId = $_GET['threadId'];
        $page = $_GET['page'];
        $hasVisited=$_GET['hasVisited'];
        $page = $page - 1; //which page to load.
        $offset = 20 * $page;
        $posts = [];
        if($hasVisited=='false'){//  incrementThreadViews
            incrementThreadViews($threadId);
        }
    $posts=loadPosts($threadId,$offset,$con);
    $authors=getAuthors($con,$posts);
    $posts=postsResult($posts,$authors);
    $thread=threadResult($threadId,$con);
    echo json_encode(loadThreadResult($page,$thread,$posts));
}
//create Thread
if(isset($_POST['createThread'])){
    $thread=json_decode($_POST['thread'],true);
    $post=json_decode($_POST['post'],true);
    $threadName=$thread['name'];
    $author=$thread['author'];
    $authorId=$author['id'];
    $forumId=$thread['forumId'];
    $text=$post["text"];
    incrementForumThreadNumber($forumId);
    $query=   "INSERT INTO threads (name, authorId, forumId ) VALUES ('$threadName', '$authorId', '$forumId')";
    $result=mysqli_query($con,$query);
    $newThreadId = $con->insert_id;
    //insert post into newly made thread
    $query=   "INSERT INTO posts (threadId, authorId, text ) VALUES ('$newThreadId ', '$authorId', '$text')";
    $result=mysqli_query($con,$query);
    $last_id = $con->insert_id;     //get post id
    setPostAsLastPostOfThread($last_id,$newThreadId);    //set this post as last post of a thread
    incrementForumPostNumber($newThreadId);
    incrementPostNumberOfThread($newThreadId);    //increment post number of a thread
    incrementUserPosts($authorId);    //increment post number of the user
    updateAccess($authorId);    //update last access
    $thread=threadResult($newThreadId,$con);
    echo json_encode($thread);
}




















