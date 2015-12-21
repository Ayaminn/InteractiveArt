#pragma strict

/*
    ChrAnimatorControl은 데모신에 배치된 캐릭터를 제어하기위한 스크립트.
    캐릭터의 이동, 애니메이션의 재생, 키 입력에 대한 반응을 합니다.
*/

//　필요한 컴포넨트, 오브젝트 등등.
var chrAnimator : Animator;    // 애니메이터 컴포넨트를 넣어둔다.
var chrAnimatorController : RuntimeAnimatorController[];// 애니메이터 컨트롤러, 뷰어용, 인터랙티브모드용.
var chrController : CharacterController;    // 캐릭터 컨트롤러 컴포넨트.
var meshData : GameObject[]; // 폴리곤수, 조인트수 등을 취득하기위해 사용, 캐릭터, 무기의 mesh데이터가 포함된 오브젝트를 입력.

//　캐릭터의 이동, 점프등을 제어하기 위해서 필요한것.
var jumpSpeed : float = 1.0;
private var moveDirection : Vector3 = Vector3.zero;
private var gravity : float = 10.0;
private var stateInfo : AnimatorStateInfo; //　지금 재생중인 스테이트를 저장.



function Update() 
{
	// 재생중인 스테이트를 저장.
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
	
	// 애니메이터의 Bool 파라메터를 false으로 되돌린다.
	if(!stateInfo.IsTag("InIdle")){
		chrAnimator.SetBool("LookAround", false);
		chrAnimator.SetBool("Attack", false);
		chrAnimator.SetBool("Jiggle", false);
		chrAnimator.SetBool("Dead", false);
	}


	// 키입력에 대한 반응을 일으킨다.
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
	// 점프 시의 처리에 대해서
	// 점프시에는 캐릭터 컨트롤러를 이용하여 캐릭터를 이동시키고 있습니다.
	// 지상에 있을때에.
	if(chrController.isGrounded){
        // 점프 플래그를 되돌린다.
		chrAnimator.SetInteger("Jump", 0);
        // moveDirection은 0으로 돌려서, 캐릭터 컨트롤러가 캐릭터를 움직이지 않도록한다.
		moveDirection = Vector3.zero;
        // 점프버튼을 눌렀을때.
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
	}
    // While in Jump
    // 점프하여 공중에 있을때.
    else if(!chrController.isGrounded){
        // 점프 버튼을 누르면 한번더 점프 할수 있다.
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
        // 공중에 있는 동안은 캐릭터 컨트롤러를 사용하여 이동하기때문에.
        // 방향키의 입력을 moveDirection에게 전달해준다.
		moveDirection = Vector3(axisInput.x * 4, moveDirection.y, axisInput.z * 4);
		moveDirection.y -= gravity * Time.deltaTime;
	}

    // moveDirection의 값을 통해 캐릭터가 이동.
	chrController.Move(moveDirection * Time.deltaTime);
}


// 애니메이터 컨트롤러를 변경한다.
// GUIControl 스크립트로부터 불려진다.
// 뷰어모드, 인터렉티브 모드 사이를 오갈때, 각각의 모드에 맞는 애니메이터를 설정한다.
function ControllerChange(idx : int ){
	chrAnimator.runtimeAnimatorController = chrAnimatorController[idx];
	PlayClip("Appear");
}


// 지정 받은 이름의 스테이트를 재생하고, 동시에 무기를 애니메이션에 맞게 장착시킨다.
// 뷰어모드용.
function PlayClip(stateName : String){
	chrAnimator.CrossFade(stateName, 0.05);
}


// 점프 버튼을 눌렀을 때.
function SetJump(){
    // 지상에 있을때.
    if(chrAnimator.GetInteger("Jump") == 0){
        // 스테이트의 태그가 InIdle, InMove일때에만 실행, moveDirection에 점프력을 입력.
  		if(stateInfo.IsTag("InIdle") || stateInfo.IsTag("InMove")){
			chrAnimator.SetInteger("Jump", 1);
			moveDirection.y += jumpSpeed;
		}
	}
    // 2단 점프.
	else if(chrAnimator.GetInteger("Jump") == 1){
        // 점프력의 반을 추가로 뛴다.
		moveDirection.y += jumpSpeed /2;
        // 낙하중에 입력을 받았다면, 낙하 속도를 추가적으로 가산.
		if(chrController.velocity.y < 0){
			moveDirection.y -= chrController.velocity.y;
		}
		chrAnimator.SetInteger("Jump", 2);
	}
}


// 3D모델 정보를 읽는다.
// 캐릭터와 무기의 폴리곤수, 정점수, 조인트수를 읽고, 합계값을 계산한다.
// GUIContol 스크립트에서 불려진다.
function GetMeshData(){
	var verts : int[] = new int[2]; // 정점수.
	var tris : int[] = new int[2]; // 삼각폴리곤수.
	var bones : int[] = new int[2]; // 조인트수.
	var mdlInfo : String = "  " + gameObject.name; // text.
	for(var i = 0; i < meshData.Length; i++){
		var skinnedMeshData : SkinnedMeshRenderer = meshData[i].GetComponent(SkinnedMeshRenderer);
        // 스키닝 된 모델은 여기서 처리.
		if(skinnedMeshData){
			verts[i] = skinnedMeshData.sharedMesh.vertices.Length;
			tris[i] = skinnedMeshData.sharedMesh.triangles.Length / 3;
			bones[i] = skinnedMeshData.bones.Length;
			mdlInfo += "\nVertex : " + verts[i].ToString();
			mdlInfo += " ,  Tris : " + tris[i].ToString();
			mdlInfo += " ,  Bones : " + bones[i].ToString();
		}
        // 스키닝 되지 않은 모델은 여기.
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


// 셰이더를 변경한다.
// GUIContol 스크립트에서 불려진다.
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


// 마테리얼의 컬러를 랜덤으로 지정한다.
// GUIContol 스크립트에서 불려진다.
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


