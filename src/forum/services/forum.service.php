<?php


require_once 'functions.php';
$con=db_connect();
if(isset($_GET['loadStats'])){
             $forumStatsArray=array();
             $nUsers=countUsers();
             $newUser=getNewestUser();
             $sumPosts=0;
             $sumThreads=0;
             for($i=1;$i<4;$i++){
                 $forumStats[$i]=new stdClass();
                 $fs=countForumThreadsAndPosts($i);
                 $forumStats[$i]->posts=$fs->postNumber;
                 $forumStats[$i]->threads=$fs->threadsNumber;
                 array_push($forumStatsArray,$forumStats[$i]);
                 $sumPosts+=$fs->postNumber;
                 $sumThreads+=$fs->threadsNumber;
             }
            $stats=createStats($sumThreads,$sumPosts,$nUsers,$newUser);
            $result =new stdClass();
            $result->stats=$stats;
            $result->forumStats=$forumStatsArray;
            echo json_encode($result);
}
if(isset($_GET['loadForum'])){
                $forumId=$_GET['forumId'];
                $page=$_GET['page'];    //which page to load
                $page=$page-1;
                $offset=20*$page;
                $threads=[];
                if($forumId=='newThreads'){ // load 5 newest threads for homepage
                        $threads=selectLast5Threads();
                        $result=new stdClass;
                        $result->page='new';
                        $result->forum=null;
                        $result->threads=$threads;
                        echo json_encode($result);
                }else
                    {//get 20 threads from forum
                        $threads=loadThreads($forumId,$offset);
                        $forum=getForum($forumId);
                        $result=new stdClass;
                        $result->page=$page+1;
                        $result->forum=$forum;
                        $result->threads=$threads;
                        echo json_encode($result);
                    }

}
