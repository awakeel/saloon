<?php
class Language
{
    public $offset = 0;

    // method declaration
    function getLanguages($offset) { 
            $newOffset = $offset + 10;
        $sql = "select * from language limit $offset,$newOffset";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $languages = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($languages);
            } else {
                echo $_GET['callback'] . '(' . json_encode($languages) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function fetchLanguages($offset) { 
            $newOffset = $offset + 10;
        $sql = "select * from language limit $offset,$newOffset";
            try {
                    $db = getConnection();
                    $stmt = $db->query($sql);
                    $languages = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($languages);
            } else {
                echo $_GET['callback'] . '(' . json_encode($languages) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
}
?>