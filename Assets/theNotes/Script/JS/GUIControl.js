#pragma strict
 
/*
    GUIControl is script to display UI elements on the screen .
*/

// required Object or information
var chrModel : GameObject[]; // Characte prehab.
private var activeLodIdx : int = 0; // Index of active object in chrModel.
private var shaderIdx : int = 0; // Index of shader in use.
var stateName : String[]; // state name in animator
private var stateLength : int; // how much state is use.
var lightObj : GameObject[]; // light object.

// for GUI.
private var ScreenSize : Vector2; // size of Game screen.
private var btnSize : Vector2 = new Vector2(120, 40); // size of buttons.
private var btnIdx : int = 0; // In viewer mode, starting point of the animation button.

private var camRotateAccept : boolean = true; // control the rotate enable or disable.
private var viewerMode : boolean = true; // is playing viewer mode or interactive mode?
private var meshInfoMsg : String; // information of 3D model object, such as number of polygons,  number of joint.
private var iModeMsg : String[] = new String[3]; // Information text on the left side of the screen, in Interactive mode.
private var iModeMsgIdx : int = 0; // Index for iModeMsg.

// Information text, in Interactive mode.
iModeMsg[0] = "\nYou can use follow keys to control Character.\n\n";
iModeMsg[0] += "arrow key : move\n";
iModeMsg[0] += "Left Alt + arrow key : run\n";
iModeMsg[0] += "Left Ctrl : Attack\n";
iModeMsg[0] += "Space Bar : Jump\n";
iModeMsg[0] += "(You can jump in air once more.)\n\n";
iModeMsg[0] += "z key : Look around\n";
iModeMsg[0] += "x key : jiggle\n";
iModeMsg[0] += "c key : happy\n";
iModeMsg[0] += "v key : sad\n";
iModeMsg[0] += "b key : disappear\n";



function Start () {
    // Screen size.
	ScreenSize = new Vector2(Screen.width, Screen.height);

    // Count number of states that are input in the Inspector window.
	stateLength = stateName.Length;

    // set 3D model information.
	meshInfoMsg = "\n" + chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).GetMeshData();
}


function OnGUI () {
	GUI.skin.button.fontSize = 12 * 1;
	GUI.skin.box.fontSize = 11 * 1;
	GUI.skin.box.alignment = TextAnchor.UpperLeft;
	
	
    // Mode selection button at the top right of the screen.
	ModeSelectBtn (ScreenSize.x - (btnSize.x + 25), 20);
    // top left of the screen.
    // When is the viewer mode to display animation play button.
    // When the interactive mode, display how to plays.
	if(viewerMode == true){
		MotionControlBtn(20, 20);
	}
	else{
		IModeInfo (20, 20);
	}

    // bottom of screen.
    // character model exchange.
    MdlChangeBtn (20, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // shader exchange.
	ShaderControlBtn (25 + btnSize.x, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // camera zoom.
	ZoomControlBtn (20, (ScreenSize.y - 20 - btnSize.y) );
    // Light control.
	LightControlBtn(30 + (btnSize.x * 2), (ScreenSize.y - 20 - btnSize.y) );

    // information of 3D model object.
	GUI.Box(Rect((ScreenSize.x / 4 * 3 - 20), (ScreenSize.y / 4 * 3 - 20), (ScreenSize.x / 4), (ScreenSize.y / 4)), meshInfoMsg);
}

// Button for exchange Game mode.
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


// animation play button, page in viewer mode.
function MotionControlBtn(posX : int, posY : int) {
	var btnPlaceX = posX;	// initial X position of animation play buttons.
	var btnPlaceY = posY;	// initial Y position of animation play buttons.
	var Nline = 6;

    // Animation play buttons.
    // Name of the button is display state name.
	for(var i = (btnIdx * Nline * 2); i < stateLength; i++){
		// around the loop (Nline) times , begin a new line.
		if(i % Nline == 0 && i != (btnIdx * Nline * 2)){
			btnPlaceX = posX;
			btnPlaceY += (btnSize.y + 5);
		}
		
		// Display button.
		if ( GUI.Button(new Rect(btnPlaceX, btnPlaceY, btnSize.x, btnSize.y),stateName[i]) ){
			chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip(stateName[i]);
		}
		
        // around the loop (Nline * 2) times, break loop.
		if ( i >= ( ((btnIdx + 1) * Nline * 2) - 1) ){
			break;
		}
		// incease X position for next loop.
		btnPlaceX += btnSize.x + 5;
	}
}


// Display information text, in Interactive mode.
function IModeInfo (posX : int, posY : int) {
	GUI.Box(Rect(posX, posY, (ScreenSize.x / 4), (ScreenSize.y / 2)),iModeMsg[iModeMsgIdx]);
}


// Button for camera control.
function ZoomControlBtn (posX : int, posY : int) {
    // camera zoom
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Camera Zoom") ){
		gameObject.GetComponent(CamControl).CamZoom();
	}

    // rotate camera
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


// Button for light object.
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

// Button for exchange character.
// use ChangeLOD().
function MdlChangeBtn (posX : int, posY : int) {
	var btnName : String = "Model : ";
	btnName += (activeLodIdx + 1).ToString() + " of " + chrModel.Length.ToString();
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeLOD ();
	}
}

// Button for exchange shader.
// use ChangeShader().
function ShaderControlBtn (posX : int, posY : int) {
	var btnName : String;
	if(shaderIdx == 0) btnName = "Material : Specular";
	else if(shaderIdx == 1) btnName = "Material : Diffuse";
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeShader();
	}
}



// change character.
function ChangeLOD () {
	chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip("Disappear");
	yield WaitForSeconds(0.333);
	
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].SetActive(false);
		if((i -  1) == activeLodIdx || (activeLodIdx - i) == (chrModel.Length - 1)){
			chrModel[i].SetActive(true);
            // to display same place.
			chrModel[i].transform.position = chrModel[activeLodIdx].transform.position;
			chrModel[i].transform.rotation = chrModel[activeLodIdx].transform.rotation;
            // Set new Color.
			chrModel[i].GetComponent(ChrAnimatorControl).SetColor();
            // play Appear.
			chrModel[i].GetComponent(ChrAnimatorControl).PlayClip("Appear");
            // set 3D model infomation newly.
			meshInfoMsg = "\n" + chrModel[i].GetComponent(ChrAnimatorControl).GetMeshData();
            // replace target of camera.
			gameObject.GetComponent(CamControl).target = chrModel[i].transform;
		}
	}
	activeLodIdx++;
	if(activeLodIdx == chrModel.Length) activeLodIdx = 0;
}


// change shader in all of chrModel
function ChangeShader () {
	shaderIdx++;
	if(shaderIdx > 1)	shaderIdx = 0;
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).SetShader(shaderIdx);
	}
}


// replace animator controller.
// when start game, or change game mode.
function ChangeAnimator (idx : int) {
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).ControllerChange(idx);
	}
}
