using UnityEngine;
using System.Collections;

/*
    GUIControl is script to display UI elements on the screen .

    GUIControlはデモシーンの画面上に各UI要素やボタンなどを配置し、.
    ユーザーの入力によりシーンをコントロールするスクリプトです。.

    GUIControl은 화면에 각종 UI요소를 배치하고,
    플레이어의 입력에 대응하여 신을 컨트롤하기위한 스크립트입니다.
	
	2015.03.01
*/

public class GUIConrtol_note : MonoBehaviour {

	// required Object or information
	// 必要なオブジェクトや、情報。.
	// 필요한 오브젝트 혹은 정보.
	public GameObject[] chrModel; // Characte prehab.
	private int activeLodIdx = 0; // Index of active object in chrModel.
	private int shaderIdx = 0; // Index of shader in use.
	public string[] stateName; // state name in animator
	private int stateLength; // how much state is use.
	public GameObject[] lightObj; // light object.
	
	// for GUI.
	private Vector2 ScreenSize; // size of Game screen.
	private Vector2 btnSize = new Vector2(120, 40); // size of buttons.
	private int btnIdx = 0; // In viewer mode, starting point of the animation button.
	
	private bool camRotateAccept = true; // control the rotate enable or disable.
	private bool viewerMode = true; // is playing viewer mode or interactive mode?
	private string meshInfoMsg; // information of 3D model object, such as number of polygons,  number of joint.
	private string[] iModeMsg = new string[3]; // Information text on the left side of the screen, in Interactive mode.

	void Start () {

		SetMsg ();

		// Screen size.
		ScreenSize = new Vector2(Screen.width, Screen.height);
		
		// Count number of states that are input in the Inspector window.
		stateLength = stateName.Length;
		
		// set 3D model information.
		meshInfoMsg = "\n" + chrModel[activeLodIdx].GetComponent<NoteAnimatorControl>().GetMeshData();
	}
	
	
	void OnGUI () {
		GUI.skin.button.fontSize = 12 * 1;
		GUI.skin.box.fontSize = 11 * 1;
		GUI.skin.box.alignment = TextAnchor.UpperLeft;
		
		// Mode selection button at the top right of the screen.
		ModeSelectBtn ( (int)(ScreenSize.x - (btnSize.x + 25)), 20);
		// top left of the screen.
		// When is the viewer mode to display animation play button.
		// When the interactive mode, display how to plays.
		// ビューアモードの時は単一アニメーション再生ボタンを並べて、.
		// インタラクティブモードの時は、操作説明を載せる。.
		// 뷰어모드일때에는 개별 애니메이션 재생 버튼을 표시.
		// 인터랙티브모드일때에는 조작설명을 표시한다.
		if(viewerMode == true){
			MotionControlBtn(20, 20);
		}
		else{
			IModeInfo (20, 20);
		}
		
		// bottom of screen.
		// character model exchange.
		MdlChangeBtn (20, (int)(ScreenSize.y - 30 - (btnSize.y * 2)) );
		// character color exchange.
		ShaderControlBtn ((int)(25 + btnSize.x), (int)(ScreenSize.y - 30 - (btnSize.y * 2)) ) ;
		// camera zoom.
		ZoomControlBtn (20, (int)(ScreenSize.y - 20 - btnSize.y) );
		// Light control.
		LightControlBtn(30 + (int)(btnSize.x * 2), (int)(ScreenSize.y - 20 - btnSize.y) );
		
		// information of 3D model object.
		GUI.Box(new Rect((ScreenSize.x * 0.25f * 3f - 20f), (ScreenSize.y * 0.25f * 3.5f - 20f), (ScreenSize.x * 0.25f), (ScreenSize.y * 0.125f)), meshInfoMsg);
	}
	
	// Button for exchange Game mode.
	// モード変更ボタンを作成.
	// ボタンを押すたびに、キャラクターアニメーターが切り替わります。.
	// 게임 모드를 변경하는 버튼.
	// 버튼을 누를때 마다 게임모드와 캐릭터 애니메이터를 전환 합니다.
	void ModeSelectBtn (int posX, int posY) {
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
	// ビューアモード時のアニメーションを再生するボタン、左右のページ送り、現在のページ表記のUIを表示します。.
	// 뷰어모드에서 사용하는 개별 애니메이션 버튼, 좌우로 페이지를 넘기는 버튼, 현재 페이지 수를 표시합니다.
	void MotionControlBtn(int posX, int posY) {
		int btnPlaceX = posX;	// initial X position of animation play buttons.
		int btnPlaceY = posY;	// initial Y position of animation play buttons.
		int Nline = 6;

		// Animation play buttons.
		// Name of the button is display state name.
		// 以下のルーフ分では、アニメーション再生ボタンを並べます。.
		// ボタンの名前には、ステート名を当てます。.
		// 개별 애니메이션 버튼을 나열한다.
		// 버튼의 이름은 스테이트 이름을 그대로 표시, Nline * 2만큼 루프를 돌면 루프에서 빠져나옴.
		for(int i = (btnIdx * Nline * 2); i < stateLength; i++){
			// around the loop (Nline) times , begin a new line.
			if(i % Nline == 0 && i != (btnIdx * Nline * 2)){
				btnPlaceX = posX;
				btnPlaceY += (int)btnSize.y + 5;
			}
			
			// Display button.
			if ( GUI.Button(new Rect(btnPlaceX, btnPlaceY, btnSize.x, btnSize.y),stateName[i]) ){
				chrModel[activeLodIdx].GetComponent<NoteAnimatorControl>().PlayClip(stateName[i]);
			}
			
			// around the loop (Nline * 2) times, break loop.
			if ( i >= ( ((btnIdx + 1) * Nline * 2) - 1) ){
				break;
			}
			// incease X position for next loop.
			btnPlaceX += (int)btnSize.x + 5;
		}
	}
	
	
	// Display information text, in Interactive mode.
	// インタラクティブモード時に左上に表示される操作説明を作成.
	// 인터랙티브모드에서는 화면 왼쪽에 조작설명을 표시
	void IModeInfo (int posX, int posY) {
		GUI.Box(new Rect(posX, posY, (ScreenSize.x / 4), (ScreenSize.y / 2)),iModeMsg[0]);
	}
	
	
	// Button for camera control.
	// カメラのズームの切り替え、回転を許容するかどうかを制御するボタンを作成.
	// 카메라 회전, 줌을 제어하는 버튼을 만든다.
	void ZoomControlBtn (int posX, int posY) {
		// camera zoom
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Camera Zoom") ){
			gameObject.GetComponent<CamControl>().CamZoom();
		}
		
		// rotate camera
		string rotateLabel;
		if(camRotateAccept == true)
			rotateLabel = "Cam Rotate ON";
		else
			rotateLabel = "Cam Rotate OFF";
		if ( GUI.Button(new Rect(posX + 5 + btnSize.x, posY, btnSize.x, btnSize.y), rotateLabel) ){
			camRotateAccept = !camRotateAccept;
			gameObject.GetComponent<CamControl>().RotateOption(camRotateAccept);
		}
	}
	
	
	// Button for light object.
	// 照明をコントロールするボタンを作成。.
	// 조명의 온, 오프를 변경하는 버튼.
	void LightControlBtn (int posX, int posY) {
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), "Light A") ){
			lightObj[0].GetComponent<Light>().enabled = !lightObj[0].GetComponent<Light>().enabled;
		}
		if ( GUI.Button(new Rect(posX + 5 + btnSize.x, posY, btnSize.x, btnSize.y), "Light B") ){
			lightObj[1].GetComponent<Light>().enabled = !lightObj[1].GetComponent<Light>().enabled;
		}
		if ( GUI.Button(new Rect((posX + (5 + btnSize.x) * 2), posY, btnSize.x, btnSize.y), "Back Light") ){
			lightObj[2].GetComponent<Light>().enabled = !lightObj[2].GetComponent<Light>().enabled;
		}
	}
	
	// Button for exchange character.
	// use ChangeLOD().
	void MdlChangeBtn (int posX, int posY) {
		string btnName = "Model : ";
		btnName += (activeLodIdx + 1).ToString() + " of " + chrModel.Length.ToString();
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnName) ){
			StartCoroutine( ChangeLOD () );
		}
	}
	
	// Button for exchange shader.
	// use ChangeShader().
	void ShaderControlBtn (int posX, int posY) {
		string btnLabel = "";
		if(shaderIdx == 0)
			btnLabel = "Material : Standard";
		else if(shaderIdx == 1)
			btnLabel = "Material : Specular";
		else if(shaderIdx == 2)
			btnLabel = "Material : Diffuse";
		if ( GUI.Button(new Rect(posX, posY, btnSize.x, btnSize.y), btnLabel) ){
			ChangeShader();
		}
	}

	// change character model.
	private IEnumerator ChangeLOD () {
		// play Idle 0.1 second before change character model.
		// It is prevent error of transform like weapon_point_hand
		// 0.1秒、IDLEを再生してからモデルを切り替える。.
		// 현재 표시 중인 모델에게 IDLE모션을 0.초간 재생시킨 후 처리를 시작한다.
		chrModel[activeLodIdx].GetComponent<NoteAnimatorControl>().PlayClip("Disappear");
		yield return new WaitForSeconds(0.1f);
		
		for(int i = 0; i < chrModel.Length; i++){
			chrModel[i].SetActive(false);
			if((i -  1) == activeLodIdx || (activeLodIdx - i) == (chrModel.Length - 1)){
				chrModel[i].SetActive(true);
				// to display same place.
				chrModel[i].transform.position = chrModel[activeLodIdx].transform.position;
				chrModel[i].transform.rotation = chrModel[activeLodIdx].transform.rotation;
				// Set new Color.
				chrModel[i].GetComponent<NoteAnimatorControl>().SetColor();
				// play Idle.
				chrModel[i].GetComponent<NoteAnimatorControl>().PlayClip(stateName[0]);
				// set 3D model infomation newly.
				meshInfoMsg = "\n" + chrModel[i].GetComponent<NoteAnimatorControl>().GetMeshData();
				// replace target of camera.
				gameObject.GetComponent<CamControl>().target = chrModel[i].transform;
			}
		}
		activeLodIdx++;
		if(activeLodIdx == chrModel.Length) activeLodIdx = 0;
	}

	// change shader in all of chrModel
	void ChangeShader () {
		shaderIdx++;
		if(shaderIdx > 2)	shaderIdx = 0;
		for(int i = 0; i < chrModel.Length; i++){
			chrModel[i].GetComponent<NoteAnimatorControl>().SetShader(shaderIdx);
		}
	}

	// replace animator controller.
	// when start game, or change game mode.
	// キャラクターアニメーターを切り替える処理.
	// 開始時、モードに切り替え時に呼ばれる。 .
	// 캐릭터 애니메이터를 교체하는 명령을 내린다.
	// 게임을 개시할 때, 게임모드를 변경할때 불려진다.
	void ChangeAnimator (int idx) {
		for(var i = 0; i < chrModel.Length; i++){
			chrModel[i].GetComponent<NoteAnimatorControl>().ControllerChange(idx);
		}
	}

	void SetMsg () {
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
	}
}
