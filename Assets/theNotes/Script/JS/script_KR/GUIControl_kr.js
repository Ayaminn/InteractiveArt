#pragma strict
 
/*
    GUIControl은 화면에 각종 UI요소를 배치하고,
    플레이어의 입력에 대응하여 신을 컨트롤하기위한 스크립트입니다.
*/

// 필요한 오브젝트 혹은 정보.
var chrModel : GameObject[]; // 캐릭터 프리팹.
private var activeLodIdx : int = 0; // chrModel배열의 오브젝트중에서 몇번을 화면에 표시할까.
private var shaderIdx : int = 0; // 몇번 셰이더를 사용할까.
var stateName : String[]; // 캐릭터 애니메이터의 스테이트 이름을 넣어둔다.
private var stateLength : int; // 스테이트의 개수.
var lightObj : GameObject[]; // 조명 오브젝트.

// UI요소를 배치하기위해 필요한것.
private var ScreenSize : Vector2; // 게임화면의 크기.
private var btnSize : Vector2 = new Vector2(120, 40); // 작성될 버튼의 크기.
private var btnIdx : int = 0; // 뷰어모드의 개별 애니메이션 재생버튼을 몇번부터 표시할지 기억함.

private var camRotateAccept : boolean = true; // 카메라의 회전을 허가할지 어떨지.
private var viewerMode : boolean = true; // 지금이 뷰어보드인지 인터랙티브 모드인지.
private var meshInfoMsg : String; // 폴리곤수, 조인트수 등등의 오브젝트의 정보를 입력.
private var iModeMsg : String[] = new String[3]; // 인터랙티브 모드일때 화면 왼쪽에 표시되는 정보.
private var iModeMsgIdx : int = 0; // 인터랙티브 모드에서 표시할 iModeMsg의 인덱스.

// 인터렉티브 모드에서 표시할 메세지.
iModeMsg[0] = "\nYou can use follow keys to control Character.\n\n";
iModeMsg[0] += "arrow key : move\n";
iModeMsg[0] += "Left Alt + arrow key : run\n";
iModeMsg[0] += "Left Ctrl : Attack\n";
iModeMsg[0] += "Space Bar : Jump\n";
iModeMsg[0] += "You can jump in air once more.\n\n";
iModeMsg[0] += "z key : Look around\n";
iModeMsg[0] += "x key : jiggle\n";
iModeMsg[0] += "c key : happy\n";
iModeMsg[0] += "v key : sad\n";
iModeMsg[0] += "b key : disappear\n";



function Start () {
    // 화면의 크기를 저장.
	ScreenSize = new Vector2(Screen.width, Screen.height);
		
    // 인스펙터 창에 입력된 스테이트의 개수를 센다.
	stateLength = stateName.Length;
    // 캐릭터의 모델 정보를 저장한다.
	meshInfoMsg = "\n" + chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).GetMeshData();
}


// 화면에 UI를 표시한다.
function OnGUI () {
	GUI.skin.button.fontSize = 12 * 1;
	GUI.skin.box.fontSize = 11 * 1;
	GUI.skin.box.alignment = TextAnchor.UpperLeft;
	
	
    // 화면 오른쪽위에 표시할 모드변경버튼.
	ModeSelectBtn (ScreenSize.x - (btnSize.x + 25), 20);
    // 화면 왼쪽위.
    // 뷰어모드일때에는 개별 애니메이션 재생 버튼을 표시.
    // 인터랙티브모드일때에는 조작설명을 표시한다.
	if(viewerMode == true){
		MotionControlBtn(20, 20);
	}
	else{
		IModeInfo (20, 20);
	}

    // 화면 하단에 표시된는것들.
    // 캐릭터 교체 버튼.
    MdlChangeBtn (20, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // 셰이더 전환 버튼.
	ShaderControlBtn (25 + btnSize.x, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // 카메라 줌을 변경.
	ZoomControlBtn (20, (ScreenSize.y - 20 - btnSize.y) );
    // 조명을 키거나 끄는 버튼.
	LightControlBtn(30 + (btnSize.x * 2), (ScreenSize.y - 20 - btnSize.y) );

    // 3D모델 정보창.
	GUI.Box(Rect((ScreenSize.x / 4 * 3 - 20), (ScreenSize.y / 4 * 3 - 20), (ScreenSize.x / 4), (ScreenSize.y / 4)), meshInfoMsg);
}

// 게임 모드를 변경하는 버튼.
// 버튼을 누를때 마다 게임모드와 캐릭터 애니메이터를 전환 합니다.
function ModeSelectBtn (posX : int, posY : int) {
	if (viewerMode == true){
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "InteractiveMode") ){
			viewerMode = false;
			ChangeAnimator (1);
		}
	}
	else if (viewerMode == false){
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "ViewerMode") ){
			viewerMode = true;	
			ChangeAnimator (0);
		}
	}
}


// 뷰어모드에서 사용하는 개별 애니메이션 버튼, 좌우로 페이지를 넘기는 버튼, 현재 페이지 수를 표시합니다.
function MotionControlBtn(posX : int, posY : int) {
	var btnPlaceX = posX;	// 개별 애니메이션 버튼의 초기 위치.
	var btnPlaceY = posY;	// 개별 애니메이션 버튼의 초기 위치.
	var Nline = 6;	// Nline개수에서 버튼을 줄바꿈함.

    // 개별 애니메이션 버튼을 나열한다.
    // 버튼의 이름은 스테이트 이름을 그대로 표시, Nline * 2만큼 루프를 돌면 루프에서 빠져나옴.
	for(var i = (btnIdx * Nline * 2); i < stateLength; i++){
		// Nline수만큼 루플르 돌면,
		// x좌표를 초기 위치로, y좌표를 버튼 하나 분 아래로 내린다.(줄바꿈).
		if(i % Nline == 0 && i != (btnIdx * Nline * 2)){
			btnPlaceX = posX;
			btnPlaceY += (btnSize.y + 5);
		}
		
		// 버튼을 만드는곳.
		if ( GUI.Button(new Rect(btnPlaceX, btnPlaceY, btnSize.x, btnSize.y),stateName[i]) ){
			chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip(stateName[i]);
		}
		
        // Nline * 2　만큼 버튼을 만들면 break.
		if ( i >= ( ((btnIdx + 1) * Nline * 2) - 1) ){
			break;
		}
		// 다음 루프를 돌기전에 x좌표를 버튼하나 만큼 증가.
		btnPlaceX += btnSize.x + 5;
	}
}


// 인터랙티브모드에서는 화면 왼쪽에 조작설명을 표시
function IModeInfo (posX : int, posY : int) {
	GUI.Box(Rect(posX, posY, (ScreenSize.x / 4), (ScreenSize.y / 2)),iModeMsg[iModeMsgIdx]);
}


// 카메라 회전, 줌을 제어하는 버튼을 만든다.
function ZoomControlBtn (posX : int, posY : int) {
    // 누를때 마다 줌을 변경하는 버튼
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Camera Zoom") ){
		gameObject.GetComponent(CamControl).CamZoom();
	}

    // 클릭, 드래그시에 카메라를 회전을 허용할지 어떨지 컨트롤 하는 버튼
	if(camRotateAccept == true){
		var rotateLabel : String = "Cam Rotate ON";
	}
	else{
		rotateLabel = "Cam Rotate OFF";
	}
	if ( GUI.Button(new Rect(posX + 5 + btnSize.x, posY, btnSize.x, btnSize.y), rotateLabel) ){
		camRotateAccept = !camRotateAccept;
		gameObject.GetComponent(CamControl).RotateOption(camRotateAccept);
	}
}


// 조명의 온, 오프를 변경하는 버튼.
function LightControlBtn (posX : int, posY : int) {
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Light A") ){
		lightObj[0].GetComponent.<Light>().enabled = !lightObj[0].GetComponent.<Light>().enabled;
	}
	if ( GUI.Button(new Rect(posX + 5 + btnSize.x, posY, btnSize.x, btnSize.y), "Light B") ){
		lightObj[1].GetComponent.<Light>().enabled = !lightObj[1].GetComponent.<Light>().enabled;
	}
	if ( GUI.Button(new Rect((posX + (5 + btnSize.x) * 2), posY, btnSize.x, btnSize.y), "Back Light") ){
		lightObj[2].GetComponent.<Light>().enabled = !lightObj[2].GetComponent.<Light>().enabled;
	}
}

// 모델을 교체하는 버튼.
// chrModel배열에 들어있는 오브젝트를 순서대로 교체해간다.
// 교체하는 처리는 ChangeLOD()함수에서 이루어진다.
function MdlChangeBtn (posX : int, posY : int) {
	var btnName : String = "Model : ";
	btnName += (activeLodIdx + 1).ToString() + " of " + chrModel.Length.ToString();
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeLOD ();
	}
}

// 셰이더를 교체하는 버튼.
// chrModel배열에 들어있는 오브젝트 전부를 일괄 처리.
// 교체는 ChangeShader()함수에서 이루어진다.
function ShaderControlBtn (posX : int, posY : int) {
	var btnName : String;
	if(shaderIdx == 0) btnName = "Material : Specular";
	else if(shaderIdx == 1) btnName = "Material : Diffuse";
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeShader();
	}
}

// 모델을 교체하는 함수.
// chrModel배열에 등록된 오브젝트를 순서대로 온, 오프시킨다.
function ChangeLOD () {
	chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip("Disappear");
	yield WaitForSeconds(0.333);
	
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].SetActive(false);
		if((i -  1) == activeLodIdx || (activeLodIdx - i) == (chrModel.Length - 1)){
			chrModel[i].SetActive(true);
            // 오브젝트를 표시할때에 이미 표시하고 있었던 오브젝트의 위치, 회전값을 넣어주어, 같은 위치에 표시하도록한다.
			chrModel[i].transform.position = chrModel[activeLodIdx].transform.position;
			chrModel[i].transform.rotation = chrModel[activeLodIdx].transform.rotation;
            // Set new Color.
			chrModel[i].GetComponent(ChrAnimatorControl).SetColor();
            // 표시된 오브젝트는 Appear모션을 재생시킨다.
			chrModel[i].GetComponent(ChrAnimatorControl).PlayClip("Appear");
            // 3D모델 정보를 다시 읽는다.
			meshInfoMsg = "\n" + chrModel[i].GetComponent(ChrAnimatorControl).GetMeshData();
            // 카메라의 타겟을 현재 표시된 오브젝트로 교체.
			gameObject.GetComponent(CamControl).target = chrModel[i].transform;
		}
	}
	activeLodIdx++;
	if(activeLodIdx == chrModel.Length) activeLodIdx = 0;
}


// 셰이더를 교체하는 함수
// chrModel배열에 등록 된 오브젝트 전부에서 명령을 내린다.
function ChangeShader () {
	shaderIdx++;
	if(shaderIdx > 1)	shaderIdx = 0;
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).SetShader(shaderIdx);
	}
}


// 캐릭터 애니메이터를 교체하는 명령을 내린다.
// 게임을 개시할 때, 게임모드를 변경할때 불려진다.
function ChangeAnimator (idx : int) {
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).ControllerChange(idx);
	}
}
