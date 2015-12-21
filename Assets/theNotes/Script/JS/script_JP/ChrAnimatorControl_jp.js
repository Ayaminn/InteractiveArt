#pragma strict

/*
    ChrAnimatorControlはデモシーンに配置されたキャラクターを制御するスクリプトです。.
    キャラクターの移動、アニメーションの再生、キー入力に対するリアクションを行います。.
*/

//　制御に必要なオブジェクトなど。
var chrAnimator : Animator;    // アニメータコンポネントを入れておく。.
var chrAnimatorController : RuntimeAnimatorController[];// アニメータコントローラを入れておく。ビューア用、インタラクティブ用.
var chrController : CharacterController;    // キャラクターコントローラコンポネント.
var meshData : GameObject[]; // キャラクターモデル、武器モデルのオブジェクトを入れます。ポリゴン数、ジョイント数などを取得するために使います。

//　キャラクターの移動や、アニメータをコントロールするもの。.
var jumpSpeed : float = 1.0;
private var moveDirection : Vector3 = Vector3.zero;
private var gravity : float = 10.0;
private var stateInfo : AnimatorStateInfo; //　再生中のステートの情報を入れる。.



function Update() 
{
	//　再生中のステートの情報を入れる。.
    stateInfo = chrAnimator.GetCurrentAnimatorStateInfo(0);

	// character moves
	var h : float = Input.GetAxis("Horizontal");
	var v : float = Input.GetAxis("Vertical");
	var axisInput : Vector3 = Vector3(h, 0, v);

	var moveSpeed : float = (h*h+v*v) * 0.25;
	if(Input.GetButton("Fire2"))	moveSpeed += 0.75;	// for Run

	chrAnimator.SetFloat("Speed", moveSpeed);

	// character rotate
	if(h + v != 0){
		if(stateInfo.IsTag("InMove") || stateInfo.IsTag("InJump")){
			axisInput = Camera.main.transform.rotation * axisInput;
			axisInput.y = 0;
			transform.forward = axisInput;
		}
	}
	//transform.Rotate(0, h * rotateSpeed, 0);
	
	// アニメータの　Bool値をfalseに戻す。.
	if(!stateInfo.IsTag("InIdle")){
		chrAnimator.SetBool("LookAround", false);
		chrAnimator.SetBool("Attack", false);
		chrAnimator.SetBool("Jiggle", false);
		chrAnimator.SetBool("Dead", false);
	}


	// キー入力に対するリアクションを起こす。.
	// for Attack
	if(Input.GetButtonDown("Fire1"))	chrAnimator.SetBool("Attack", true);
    
	// LookAround
	if(Input.GetKeyDown("z"))	chrAnimator.SetBool("LookAround", true);
	// Jiggle
	if(Input.GetKeyDown("x"))	chrAnimator.SetBool("Jiggle", true);

	// Happy!!
	if(Input.GetKeyDown("c"))
	{
		chrAnimator.SetBool("Happy", !chrAnimator.GetBool("Happy"));
		if(chrAnimator.GetBool("Happy") == true)	chrAnimator.SetBool("Sad", false);
	}
	// Sad
	if(Input.GetKeyDown("v"))
	{
		chrAnimator.SetBool("Sad", !chrAnimator.GetBool("Sad"));
		if(chrAnimator.GetBool("Sad") == true)	chrAnimator.SetBool("Happy", false);
	}
	
	// for Dead
	if(Input.GetKeyDown("b"))	chrAnimator.SetBool("Dead", true );

	// for Jump
	// ジャンプ処理.
	// ジャンプ時は、キャラクターコントローラを使ってキャラクターを移動させます。.
	// 地上にいるとき。.
	if(chrController.isGrounded){
        // ジャンププラグを元に戻す。.
		chrAnimator.SetInteger("Jump", 0);
        // moveDirectionはゼロにして、キャラクターコントローラがキャラクターを動かさないように。.
		moveDirection = Vector3.zero;
        // ジャンプボタンを押したとき。.
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
	}
    // While in Air
    // ジャンプし、空中にいるとき。.
    else if(!chrController.isGrounded){
        // ジャンプボタンを押すともう一度ジャンプできる。.
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
        // 空中にいるときはmoveDirectionを使って移動するので、.
        // 方向キーの入力を渡しておく。.
		moveDirection = Vector3(axisInput.x * 4, moveDirection.y, axisInput.z * 4);
		moveDirection.y -= gravity * Time.deltaTime;
	}

    // moveDirectionを元にキャラクターが移動する。.
	chrController.Move(moveDirection * Time.deltaTime);
}


// アニメータコントローラを変更する。 .
// GUIControlスクリプトから呼ばれる。 .
// ビューアモード、インタラクティブモードが切り替わるときに、各モード用にアニメータコントローラを差し替える。.
function ControllerChange(idx : int ){
	chrAnimator.runtimeAnimatorController = chrAnimatorController[idx];
	PlayClip("Appear");
}


// 指定ステートを再生。.
// 引数に指定されたステートを再生する。.
// ビューアモード用。.
function PlayClip(stateName : String){
	chrAnimator.CrossFade(stateName, 0.05);
}


// ジャンプボタン入力時。.
function SetJump(){
    // 地上で入力されたとき。.
    if(chrAnimator.GetInteger("Jump") == 0){
        // ステートがInIdle、InMoveタグの時のみ実行。キャラクターコントローラを使うので、moveDirectionを使う。.
  		if(stateInfo.IsTag("InIdle") || stateInfo.IsTag("InMove")){
			chrAnimator.SetInteger("Jump", 1);
			moveDirection.y += jumpSpeed;
		}
	}
    // 二段ジャンプ。.
	else if(chrAnimator.GetInteger("Jump") == 1){
        // 二段ジャンプ、ジャンプ力の半分を飛べる。.
		moveDirection.y += jumpSpeed /2;
        // 落下中であれば、落下スピードを出してもうちょっと飛ばす。.
		if(chrController.velocity.y < 0){
			moveDirection.y -= chrController.velocity.y;
		}
		chrAnimator.SetInteger("Jump", 2);
	}
}


// オブジェクトの情報を取得します。.
// キャラクターと武器の、頂点数、三角ポリゴン数、ジョイント数を取得し、.
// キャラクターと武器の合計値も入れました。.
function GetMeshData(){
	var verts : int[] = new int[2]; // 頂点数.
	var tris : int[] = new int[2]; // 三角ポリゴン数.
	var bones : int[] = new int[2]; // ジョイント数.
	var mdlInfo : String = "  " + gameObject.name; // text.
	for(var i = 0; i < meshData.Length; i++){
		var skinnedMeshData : SkinnedMeshRenderer = meshData[i].GetComponent(SkinnedMeshRenderer);
        // スキニングされたものならこっちで処理される。.
		if(skinnedMeshData){
			verts[i] = skinnedMeshData.sharedMesh.vertices.Length;
			tris[i] = skinnedMeshData.sharedMesh.triangles.Length / 3;
			bones[i] = skinnedMeshData.bones.Length;
			mdlInfo += "\nVertex : " + verts[i].ToString();
			mdlInfo += " ,  Tris : " + tris[i].ToString();
			mdlInfo += " ,  Bones : " + bones[i].ToString();
		}
        // スキニングされてない、ポリゴンのみのオブジェクトならこっちで処理する。.
		else{
			verts[i] = meshData[i].GetComponent(MeshFilter).sharedMesh.vertices.Length;
			tris[i] = meshData[i].GetComponent(MeshFilter).sharedMesh.triangles.Length / 3;
			bones[i] = 0;
			mdlInfo += "\nVertex : " + verts[i].ToString();
			mdlInfo += " ,  Tris : " + tris[i].ToString();
			mdlInfo += " ,  Bones : no use.";
		}
	}
	return (mdlInfo);
}


// シェーダーを変更します。.
// GUIContorlスクリプトから呼ばれます。.
function SetShader(shaderId : int){
	var ShaderName : String[] = new String[2];
	ShaderName[0] = "Specular";
	ShaderName[1] = "Diffuse";
	
	for(var i = 0; i < meshData.Length; i++){
		var skinnedMeshData : SkinnedMeshRenderer = meshData[i].GetComponent(SkinnedMeshRenderer);
		if(skinnedMeshData){
			skinnedMeshData.material.shader = Shader.Find(ShaderName[shaderId]);
		}
		else{
			meshData[i].GetComponent(MeshRenderer).material.shader = Shader.Find(ShaderName[shaderId]);
		}
	}
}


// マテリアルの色をランダムで変更する。.
// GUIContorlスクリプトから呼ばれます。.
function SetColor(){
	var newColor : Color;
	newColor.r = (Random.Range(0, 17) / 16.0);
	newColor.g = (Random.Range(0, 17) / 16.0);
	newColor.b = (Random.Range(0, 17) / 16.0);
	newColor.a = 1.0;

	for(var i = 0; i < meshData.Length; i++){
		var skinnedMeshData : SkinnedMeshRenderer = meshData[i].GetComponent(SkinnedMeshRenderer);
		if(skinnedMeshData){
			skinnedMeshData.material.color = newColor;
		}
		else{
			meshData[i].GetComponent(MeshRenderer).material.color = newColor;
		}
	}
}


