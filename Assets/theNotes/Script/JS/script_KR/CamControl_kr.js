#pragma strict
 
/*
	CamControl은 데모신의 카메라, 조명이 포함된 __Cam 오브젝트를 제어하여
	화면상에 항상 캐릭터를 비추도록 하는 스크립트입니다.
*/


// 스크립트가 제어하는 오브젝트 
var cam : Camera; // Main camera
var camSub : Transform; // SubObject for vertical rocation
var target : Transform; // Main Character
var ground : Transform; // Ground

// for Camera Rotation
// 카메라의 회전을 제어하는데 사용
var rotateSpeed : float = 10.0; // how fast rotate cam.
private var rotateEnable : boolean = true; // 카메라 회전기능의 온/오프
private var rotation : Vector3; // 마우스 왼쪽 클릭, 드래그 시에 입력치를 저장함 

// 카메라의 줌 기능 제어를 위해 사용 
var zoom : int[] = new int[2]; // 카메라의 FOV수치를 입력해둔다.
var smooth : float = 5; // 줌하는 속도
private var zoomIdx : int = 0; // 현재 바라보는 zoom배열의 인덱스


function Update () {

	// When Left Click & Drag sceen.
	// 왼쪽클릭 드래그시에 rotation에 입력치를 저장합니다.
    if (Input.GetMouseButton(0)) {
		rotation.y = Input.GetAxis("Mouse X") * rotateSpeed;
		rotation.x = Input.GetAxis("Mouse Y") * rotateSpeed;
	}
    else{
		rotation = Vector3.zero;
	}

    // rotation값을 CamRotate()에 넘겨주어 화면을 회전시킨다.
	if(rotateEnable){
		CamRotate(rotation);
	}
		
	// When Right Click.
	// 오른쪽 클릭시에는 카메라 줌을 한다.
	if(Input.GetMouseButtonDown(1)){
		CamZoom();
	}
	cam.fieldOfView = Mathf.Lerp(cam.fieldOfView,zoom[zoomIdx],Time.deltaTime*smooth);
	
	
}

// LateUpdate에서는 캐릭터모델을 쫓아 카메라와 지면을 이동시킨다.
function LateUpdate() 
{	
    // 지면이 무한히 이어져있는듯이 보이도록하기위해,
    // 캐릭터와 지면이 5이상 떨어졌을때, 지면을 5이동시킨다.
	if( (target.position.x - ground.position.x) >= 5)
		ground.position.x += 5;
	else if((target.position.x - ground.position.x) <= -5)
		ground.position.x -= 5;
	if((target.position.z - ground.position.z) >= 5)
		ground.position.z += 5;
	else if((target.position.z - ground.position.z) <= -5)
		ground.position.z -= 5;

    // 카메라 본체는 항상 캐릭터를 쫒아간다.
	transform.position.x = target.position.x;
	transform.position.z = target.position.z;
	camSub.position.y = target.position.y;
}	

// 카메라를 회전시키는 함수
function CamRotate(rot : Vector3){
	// 전체를 옆으로 회전 
    transform.Rotate(0, rot.y, 0);

	// 상하로 회전할때에는 카메라가 수직, 수평을 유지한채 회전하기위해
	// 본체가 아닌 보조 오브젝트를 회전시킨다.
    var currentRotateAngle : float = camSub.localRotation.eulerAngles.x;
    currentRotateAngle += rot.x;
	// 회전은 0에서 60으로 제한.
    if(currentRotateAngle >= 60) currentRotateAngle = 60;
    else if(currentRotateAngle <= 0) currentRotateAngle = 0;
    camSub.localRotation = Quaternion.Euler(currentRotateAngle, 0, 0);
}


// 카메라의 줌을 당기는 함수.
// FOV 수치를 zoom변수에 저장해두고,
// 함수가 불려질때마다 zoom배열의 참조인덱스를 바꾸어준다.
function CamZoom(){
	zoomIdx++;
	if(zoomIdx >= zoom.Length){
		zoomIdx = 0;
	}
}

// RotateOption()함수는 GUIControl에서 불려진다.
// 화면회전 기능의 온/오프를 제어한다.
function RotateOption(enable : boolean){
   rotateEnable = enable;
}