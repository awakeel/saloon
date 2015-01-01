<?php
class Language
{
    public $offset = 0;

    // method declaration
    function getLanguages( ) {  
        $sql = "select * from language  ";
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
    function fetchLanguagesSpecific($languageid) { 
          
        $sql = "select title,languagetitle from languagetranslate where languageid = :id  ";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("id", $languageid);
                    $stmt->execute();
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
    function fetchLanguages($languageid,$search) {
        if($search)
        	$search = "and title like %$search%";
    	$sql = "select * from languagetranslate where languageid =:id  $search";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $languageid);
    	 
    		$stmt->execute();
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
    function saveLanguageTranslate($request){
    	 
    		$params = json_decode($request->getBody());
    		$sql = "INSERT INTO languagetranslate (languageid, title,languagetitle) ";
    		$sql .="VALUES (:languageid, :title,  :languagetitle)";
    		try {
    			$db = getConnection();
    			$stmt = $db->prepare($sql);
    			$stmt->bindParam("languageid", $params->languageid);
    			$stmt->bindParam("title", $params->title);
    			$stmt->bindParam("languagetitle", $params->languagetitle); 
    	
    			$stmt->execute();
    			$params->id = $db->lastInsertId();
    			$db = null;
    			echo json_encode($params);
    		} catch(PDOException $e) {
    			//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    			echo '{"error":{"text":'. $e->getMessage() .'}}';
    		}
    	 
    }
    function deleteLanguageTranslate($id){
    	 
    	$sql = "delete from languagetranslate where id=:id ";
    	 
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute(); 
    		$db = null;
    		echo json_encode($id);
    	} catch(PDOException $e) {
    		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    }
}
?>