#pragma strict
 
/*
    CamControlはデモシーンにおいて、カメラと照明が含まれた__Camというオブジェクト群を操作し、.
    常に画面上にキャラクターが移るようにするためのスクリプトです。.
*/


// スクリプトで制御するオブジェクト.
var cam : Camera; // メインカメラ.
var camSub : Transform; // カメラのY軸回転用のオブジェクト.
var target : Transform; // キャラクターオブジェクト.
var ground : Transform; // 地面オブジェクト.

// カメラの回転に使う変数.
var rotateSpeed : float = 10.0; // カメラの回転スピード.
private var rotateEnable : boolean = true; // カメラの回転を許容するかどうか.
private var rotation : Vector3; // マウス左クリック時の入力値を格納.

// カメラのズームに使う変数.
var zoom : int[] = new int[2]; // カメラのFOV値を何種類か設定しておく.
var smooth : float = 5;// ズームするスピード
private var zoomIdx : int = 0; // 参照したいzoom変数のインデックス.


// 毎フレームよばれるもの.
function Update () {

	// 左クリック＆ドラッグ時の処理。
	// 左クリック＆ドラッグ時にその値rotation変数に入れます.
	// 入力がないときは0にして回らないように.
    if (Input.GetMouseButton(0)) {
		rotation.y = Input.GetAxis("Mouse X") * rotateSpeed;
		rotation.x = Input.GetAxis("Mouse Y") * rotateSpeed;
	}
    else{
		rotation = Vector3.zero;
	}

    // rotation値を元に、カメラを回転させます。.
    // CamRotate()関数は、回転が許容された場合(rotateEnable = true)のみ、呼ばれます。.
	if(rotateEnable){
		CamRotate(rotation);
	}
		
	// 右クリック時の処理.
	// 右クリック時は、画面をズームさせます.
	if(Input.GetMouseButtonDown(1)){
		CamZoom();
	}
	cam.fieldOfView = Mathf.Lerp(cam.fieldOfView,zoom[zoomIdx],Time.deltaTime*smooth);
	
	
}

// LateUpdateでは、キャラクターの位置を見て、カメラと、地面を移動させます。.
function LateUpdate() 
{	
    // キャラクター(target)と、地面(ground)の位置差が5以上離れると、地面を5移動させる。.
    // 地面(ground)が無限に続いているような気持になる。.
	if( (target.position.x - ground.position.x) >= 5)
		ground.position.x += 5;
	else if((target.position.x - ground.position.x) <= -5)
		ground.position.x -= 5;
	if((target.position.z - ground.position.z) >= 5)
		ground.position.z += 5;
	else if((target.position.z - ground.position.z) <= -5)
		ground.position.z -= 5;

    // カメラはキャラクターについて行きます。.
	transform.position.x = target.position.x;
	transform.position.z = target.position.z;
	camSub.position.y = target.position.y;
}	

// カメラを回転させる関数.
function CamRotate(rot : Vector3){
	// 全体を横回転.
    transform.Rotate(0, rot.y, 0);

	// 縦の回転は、水平を保ったままにしたい。.
	// 本体ではなくcamSubに格納されたオブジェクトを回す。.
    var currentRotateAngle : float = camSub.localRotation.eulerAngles.x;
    currentRotateAngle += rot.x;
	//回転は0から60まで。.
	if(currentRotateAngle >= 60)	currentRotateAngle = 60;
    else if(currentRotateAngle <= 0)	currentRotateAngle = 0;
    camSub.localRotation = Quaternion.Euler(currentRotateAngle, 0, 0);
}


// カメラのズームを変える関数.
// ズームの値は、zoom配列にあらかじめ設定しておき、.
// 参照するzoom配列のインデックス(zoomIdx)変えるだけ。.
function CamZoom(){
	zoomIdx++;
	if(zoomIdx >= zoom.Length){
		zoomIdx = 0;
	}
}

// RotateOption()関数はGUIControlスクリプトから呼ばれる.
// 回転を許容するかどうか制御する.
function RotateOption(enable : boolean){
   rotateEnable = enable;
}