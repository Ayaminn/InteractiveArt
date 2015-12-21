#pragma strict
 
/*
	CamControl is the scrpipt for the control of camera and light that contains the object to __cam.
*/


// Object for Control
var cam : Camera; // Main camera
var camSub : Transform; // SubObject for vertical rocation
var target : Transform; // Main Character
var ground : Transform; // Ground

// for Camera Rotation
var rotateSpeed : float = 10.0; // how fast rotate cam.
private var rotateEnable : boolean = true; // Allows rotation of the camera
private var rotation : Vector3; // Input value of  the left click and drag 

// Used to control the camera zoom
var zoom : int[] = new int[2]; // Camera's FOV values​​.
var smooth : float = 5; // speed to zoom
private var zoomIdx : int = 0;


function Update () {

	// When Left Click & Drag sceen.
    if (Input.GetMouseButton(0)) {
		rotation.y = Input.GetAxis("Mouse X") * rotateSpeed;
		rotation.x = Input.GetAxis("Mouse Y") * rotateSpeed;
	}
    else{
		rotation = Vector3.zero;
	}

	// Camera rotates by rotation.
	if(rotateEnable){
		CamRotate(rotation);
	}
		
	// When Right Click.
	// Camera zoom.
	if(Input.GetMouseButtonDown(1)){
		CamZoom();
	}
	cam.fieldOfView = Mathf.Lerp(cam.fieldOfView,zoom[zoomIdx],Time.deltaTime*smooth);
	
	
}

// In LateUpdate, camera and ground are move to place of character model.
function LateUpdate() 
{	
    // Show that ground like infinity place, 
    // Distance of ground and character leaves 5 ​​or more , ground move.
	if( (target.position.x - ground.position.x) >= 5)
		ground.position.x += 5;
	else if((target.position.x - ground.position.x) <= -5)
		ground.position.x -= 5;
	if((target.position.z - ground.position.z) >= 5)
		ground.position.z += 5;
	else if((target.position.z - ground.position.z) <= -5)
		ground.position.z -= 5;

    // __cam always follow characer.
	transform.position.x = target.position.x;
	transform.position.z = target.position.z;
	camSub.position.y = target.position.y;
}	

// Function for rotate Camera.
function CamRotate(rot : Vector3){
	// horizontal rotate 
    transform.Rotate(0, rot.y, 0);

	// When the camera is rotated vertically, to order to maintain horizontal, 
	// rotate __cam instead of camSub.
    var currentRotateAngle : float = camSub.localRotation.eulerAngles.x;
    currentRotateAngle += rot.x;
	// limit rotation 0 to 60.
    if(currentRotateAngle >= 60) currentRotateAngle = 60;
    else if(currentRotateAngle <= 0) currentRotateAngle = 0;
    camSub.localRotation = Quaternion.Euler(currentRotateAngle, 0, 0);
}


// Function for camera zoom
// FOV value is in zoom array.
// This function is just change zoomIdx value.
function CamZoom(){
	zoomIdx++;
	if(zoomIdx >= zoom.Length){
		zoomIdx = 0;
	}
}

// RotateOption () is called from GUIControl.
// It is control the rotate enable or disable.
function RotateOption(enable : boolean){
   rotateEnable = enable;
}