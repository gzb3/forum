<?php


require_once 'functions.php';
$con=db_connect();

//load new messages (notifications)
if(isset($_GET['loadNewMessages'])){
    $userId=$_GET['userId'];
    $seenMessageIds=selectSeenMessages($userId);
    $allMessagesForUser=getAllMessagesForUser($userId);
    $result=filterOutSeenMessages($allMessagesForUser,$seenMessageIds,$userId);
    echo json_encode($result);
}
//load conversation
if(isset($_GET['loadMessages'])){
    $conversationId=$_GET['conversationId'];
    $lastMessageId=$_GET['lastMessageId'];
    $userId=$_GET['userId'];
    $conversation=getConversation($conversationId);
    $messages=getMessages($userId,$lastMessageId,$conversationId);
    $result=[$conversation,$messages];
    echo json_encode($result);
}
//load conversations by user
if(isset($_GET['loadConversations'])){
    $userId=$_GET['userId'];
    $ids=selectWhereUserIsParticipant($userId);
    if($ids){
        $conversations=selectConversations($ids);
        $participants=selectParticipants($ids);
        $conversations=attachAvatars($conversations,$participants);
        echo json_encode($conversations);
    }else echo json_encode([]);
}
//create message
if (isset($_POST['createMessage'])){
    $message=json_decode($_POST['message'],true);
    $author=$message['author'];
    $conversationId=$message['conversationId'];
    $authorId=$author['id'];
    $text=$message['text'];
    $messageId=insertMessage($conversationId,$authorId,$text);
    $message=getMessage($messageId);
    echo json_encode($message);
}
//create conversation
if(isset($_POST['createConversation'])) {
    $conversation = json_decode($_POST['conversation'], true);
    $message = json_decode($_POST['message'], true);
    $author = $conversation['author'];
    $title=$conversation['title'];
    $authorId = $author['id'];
    $participants=$conversation['participants'];
    $text = $message['text'];
      $conversation=insertConversation($authorId,$title);
      $conversationId=$conversation->id;
      insertParticipants($participants,$conversationId);
      insertMessage($conversationId,$authorId,$text);
      $conversation->author=loadUser($authorId);
      echo json_encode($conversation);
}



















