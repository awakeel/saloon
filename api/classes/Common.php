<?php
class Common
{ 

    // method declaration
    function __construct($app){
    	$app->get('/countries', function () {
    		$this->getAllCountries( );
    	});
    		$app->get('/currencies', function () {
    			$this->getAllCurrencies(  );
    		});
    			$app->get('/timings', function () {
    				$this->getAllTimings(  );
    			});
    }
     
    function getAllCountries( ) { 
          
        $sql = "select * from countries";
            try {
                    $db = getConnection();
                    $stmt = $db->prepare($sql); 
                    $stmt->execute();
                    $countries = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $db = null;

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($countries);
            } else {
                echo $_GET['callback'] . '(' . json_encode($countries) . ');';
            }

            } catch(PDOException $e) {
                    $error = array("error"=> array("text"=>$e->getMessage()));
                    echo json_encode($error);
            }
    }
    function getAllCurrencies( ) {
    
    	$sql = "select * from currencies";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$currencies = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($currencies);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($currencies) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
    function getAllTimings( ) {
    
    	$sql = "select * from timings";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->execute();
    		$timings = $stmt->fetchAll(PDO::FETCH_OBJ);
    		$db = null;
    
    		// Include support for JSONP requests
    		if (!isset($_GET['callback'])) {
    			echo json_encode($timings);
    		} else {
    			echo $_GET['callback'] . '(' . json_encode($timings) . ');';
    		}
    
    	} catch(PDOException $e) {
    		$error = array("error"=> array("text"=>$e->getMessage()));
    		echo json_encode($error);
    	}
    }
}
?>