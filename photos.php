<?php
error_reporting(E_ALL);    
require_once "Zend/Debug.php";

class Photo{
    var $_data = array(
        'src' => '',
        'title' => '',
        'tags' => '',
        'location' => ''
        );
    
    public function __set($name, $value) {
        if(isset($this->_data[$name])){
            $this->_data[$name] = $value;
        } else {
            throw new Exception("Invalid attribute: ".$name);
        }
        
    }
    
    public function __get($name) {
        if(isset($this->_data[$name])){
           return $this->_data[$name];
        } else {
           throw new Exception("Invalid attribute: ".$name);  
        }
    }
    
    public function toArray(){
        return $this->_data;
    }
}

$p = new Photo();
$p->title= "diego";
$p->src = "blah.com";

echo Zend_Debug::dump($p->toArray());

echo "hola";