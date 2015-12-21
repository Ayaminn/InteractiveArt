#pragma strict
 
/*
    GUIControlはデモシーンの画面上に各UI要素やボタンなどを配置し、.
    ユーザーの入力によりシーンをコントロールするスクリプトです。.
*/

// 必要なオブジェクトや、情報。.
var chrModel : GameObject[]; // キャラクターのプレハブ.
private var activeLodIdx : int = 0; // chrModel配列の中の、画面に表示されるオブジェクトのインデックス.
private var shaderIdx : int = 0; // キャラクターに使われるシェーダーのインデックス.
var stateName : String[]; // アニメータのステートの名前を入れておく.
private var stateLength : int; // ステートの数.
var lightObj : GameObject[]; // 照明を入れておく。.

// UI要素の配置のためのもの。.
private var ScreenSize : Vector2; // 画面サイズ.
private var btnSize : Vector2 = new Vector2(120, 40); // ボタンの大きさ.
private var btnIdx : int = 0; // ビューアモードのアニメーション再生ボタンの表示されるボタンの配列初期値や、ページ数に使う。.

private var camRotateAccept : boolean = true; // カメラの回転を許容するかどうか。.
private var viewerMode : boolean = true; // 今のモードがビューアモードかインタラクティブモードか。.
private var meshInfoMsg : String; // オブジェクトの情報が入る。ポリゴン数ジョイント数など。.
private var iModeMsg : String[] = new String[3]; // インタラクティブモードモード時に表示される文面。.
private var iModeMsgIdx : int = 0; // インタラクティブモードモード時に表示される文面のページ数。

// 以下のものはインタラクティブモード時に表示されるものです。.
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



// プレイ開始時に呼ばれる。.
function Start () {
    // 画面の大きさ.
	ScreenSize = new Vector2(Screen.width, Screen.height);
		
    // 入力されたステートの数を数えておく。.
	stateLength = stateName.Length;
    // キャラクターのオブジェクト情報を取得する。.
	meshInfoMsg = "\n" + chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).GetMeshData();
}


// 画面にUIを表示します。.
function OnGUI () {
	GUI.skin.button.fontSize = 12 * 1;
	GUI.skin.box.fontSize = 11 * 1;
	GUI.skin.box.alignment = TextAnchor.UpperLeft;
	
	
    // 画面右上のモード変更ボタン.
	ModeSelectBtn (ScreenSize.x - (btnSize.x + 25), 20);
    // 画面左上の表示物.
    // ビューアモードの時は単一アニメーション再生ボタンを並べて、.
    // インタラクティブモードの時は、操作説明を載せる。.
	if(viewerMode == true){
		MotionControlBtn(20, 20);
	}
	else{
		IModeInfo (20, 20);
	}

    // 画面下表示されるもの。.
    // キャラクター切り替えボタン。.
    MdlChangeBtn (20, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // シェーダー切り替えボタン。.
	ShaderControlBtn (25 + btnSize.x, (ScreenSize.y - 30 - (btnSize.y * 2)) );
    // カメラのズームを切り替えるボタン。.
	ZoomControlBtn (20, (ScreenSize.y - 20 - btnSize.y) );
    // 照明をつけたり消したりするボタン.
	LightControlBtn(30 + (btnSize.x * 2), (ScreenSize.y - 20 - btnSize.y) );

    // オブジェクト情報窓.
	GUI.Box(Rect((ScreenSize.x / 4 * 3 - 20), (ScreenSize.y / 4 * 3 - 20), (ScreenSize.x / 4), (ScreenSize.y / 4)), meshInfoMsg);
}

// モード変更ボタンを作成.
// ボタンを押すたびに、キャラクターアニメーターが切り替わります。.
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


// ビューアモード時のアニメーションを再生するボタン、左右のページ送り、現在のページ表記のUIを表示します。.
function MotionControlBtn(posX : int, posY : int) {
	var btnPlaceX = posX;	// アニメーション再生ボタンの初期位置 .
	var btnPlaceY = posY;	// アニメーション再生ボタンの初期位置.
	var Nline = 6;	// ボタンが改行される個数.

    // 以下のルーフ分では、アニメーション再生ボタンを並べます。.
    // ボタンの名前には、ステート名を当てます。.
    // Nline * 2　までボタンを並べたら、ルーフを抜けます。.
	for(var i = (btnIdx * Nline * 2); i < stateLength; i++){
		// ルーフがNlineの数分回ったら、改行する。,
		// x座標は初期位置に、y座標はボタン一個分下に下げる。.
		if(i % Nline == 0 && i != (btnIdx * Nline * 2)){
			btnPlaceX = posX;
			btnPlaceY += (btnSize.y + 5);
		}
		
		// ボタンを作る。,
		if ( GUI.Button(new Rect(btnPlaceX, btnPlaceY, btnSize.x, btnSize.y),stateName[i]) ){
			chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip(stateName[i]);
		}
		
        // Nline * 2　までルーフしたら、breakする。.
		if ( i >= ( ((btnIdx + 1) * Nline * 2) - 1) ){
			break;
		}
		// 次のルーフに入る前に、ｘ座標を増加させる。.
		btnPlaceX += btnSize.x + 5;
	}
}


// インタラクティブモード時に左上に表示される操作説明.
function IModeInfo (posX : int, posY : int) {
	GUI.Box(Rect(posX, posY, (ScreenSize.x / 4), (ScreenSize.y / 2)),iModeMsg[iModeMsgIdx]);
}



// カメラのズームの切り替え、回転を許容するかどうかを制御するボタンを作成.
function ZoomControlBtn (posX : int, posY : int) {
    // 押すたびに、カメラのズームが切り替わるボタン.
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Camera Zoom") ){
		gameObject.GetComponent(CamControl).CamZoom();
	}

    // カメラの回転を許容するかどうか制御するボタン.
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


// 照明をコントロールするボタンを作成。.
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

// モデルを切り替えるボタン.
// chrModel配列に入っているオブジェクトを順番に切り替えます。.
// 切り替え処理は、後述のChangeLOD()関数で行います。.
function MdlChangeBtn (posX : int, posY : int) {
	var btnName : String = "Model : ";
	btnName += (activeLodIdx + 1).ToString() + " of " + chrModel.Length.ToString();
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeLOD ();
	}
}

// シェーダーを切り替えるボタン.
// chrModel配列に入っている全部のオブジェクト全部に適用します。.
// 切り替え処理は、後述のChangeShader()関数で行います。.
function ShaderControlBtn (posX : int, posY : int) {
	var btnName : String;
	if(shaderIdx == 0) btnName = "Material : Specular";
	else if(shaderIdx == 1) btnName = "Material : Diffuse";
	if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
		ChangeShader();
	}
}

// モデルを切り替える処理.
// LODControlBtn()関数で呼ばれる。 .
// chrModel配列に登録されたオブジェクトを順番に表示、非表示と切り替えていきます。 .
function ChangeLOD () {
	chrModel[activeLodIdx].GetComponent(ChrAnimatorControl).PlayClip("Disappear");
	yield WaitForSeconds(0.333);
	
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].SetActive(false);
		if((i -  1) == activeLodIdx || (activeLodIdx - i) == (chrModel.Length - 1)){
			chrModel[i].SetActive(true);
            // 表示されたオブジェクトには、前回表示していたオブジェクトの位置、回転値を与えて、同じ位置に表示させる。.
			chrModel[i].transform.position = chrModel[activeLodIdx].transform.position;
			chrModel[i].transform.rotation = chrModel[activeLodIdx].transform.rotation;
            // Set new Color.
			chrModel[i].GetComponent(ChrAnimatorControl).SetColor();
            // 表示が切り替わる際には、Appearモーションが再生されるように。.
			chrModel[i].GetComponent(ChrAnimatorControl).PlayClip("Appear");
            // オブジェクト情報を入れなおす。.
			meshInfoMsg = "\n" + chrModel[i].GetComponent(ChrAnimatorControl).GetMeshData();
            // カメラのターゲットを今表示されたオブジェクトに変更。.
			gameObject.GetComponent(CamControl).target = chrModel[i].transform;
		}
	}
	activeLodIdx++;
	if(activeLodIdx == chrModel.Length) activeLodIdx = 0;
}

// シェーダーを切り替える処理.
// ShaderControlBtn ()関数で呼ばれる。 .
// chrModel配列に登録されたオブジェクト全部に適用します。 .
function ChangeShader () {
	shaderIdx++;
	if(shaderIdx > 1)	shaderIdx = 0;
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).SetShader(shaderIdx);
	}
}


// キャラクターアニメーターを切り替える処理.
// 開始時、モードに切り替え時に呼ばれる。 .
function ChangeAnimator (idx : int) {
	for(var i = 0; i < chrModel.Length; i++){
		chrModel[i].GetComponent(ChrAnimatorControl).ControllerChange(idx);
	}
}
