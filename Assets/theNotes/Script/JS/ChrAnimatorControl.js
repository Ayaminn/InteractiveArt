#pragma strict

/*
    ChrAnimatorControl is script to control the characters in demoscene.
    will move character , play animation , reaction of key input.
*/

// required Object or component
var chrAnimator : Animator;    // Animator component of character.
var chrAnimatorController : RuntimeAnimatorController[];// AnimatorController for viewer and interactive
var chrController : CharacterController;    // CharacterController component.
var meshData : GameObject[]; // character and weapon , the object mesh data is included.

// to control movement of characters , such as jumps.
var jumpSpeed : float = 1.0;
private var moveDirection : Vector3 = Vector3.zero;
private var gravity : float = 10.0;
private var stateInfo : AnimatorStateInfo; // Save the state in playing now.


function Update() 
{
	// Save the state in playing now.
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
	
	// Bool parameter reset to false. 
	if(!stateInfo.IsTag("InIdle")){
		chrAnimator.SetBool("LookAround", false);
		chrAnimator.SetBool("Attack", false);
		chrAnimator.SetBool("Jiggle", false);
		chrAnimator.SetBool("Dead", false);
	}

	// reaction of key input.
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
	// while in jump, I am using Character Controller instead Root Motion, to move the Character.
	// in ground.
	if(chrController.isGrounded){
        // jump parameter set to false.
		chrAnimator.SetInteger("Jump", 0);
        // moveDirection set 0, to prevent to move by Character controller.
		moveDirection = Vector3.zero;
        // press Jump button. make jump
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
	}
    // While in Air
    else if(!chrController.isGrounded){
        // press Jump button. can jump once more.
		if(Input.GetButtonDown("Jump")){
			SetJump();
		}
        // It is moved with Character Controller while in the air,
        // moveDirection is use Axis Input.
		moveDirection = Vector3(axisInput.x * 4, moveDirection.y, axisInput.z * 4);
		moveDirection.y -= gravity * Time.deltaTime;
	}

    // character is move by moveDirection.
	chrController.Move(moveDirection * Time.deltaTime);
}



// change Animator Controller.
// this function is called from GUIControl.
function ControllerChange(idx : int ){
	chrAnimator.runtimeAnimatorController = chrAnimatorController[idx];
	PlayClip("Appear");
}


// play state.
// for viewer mode
function PlayClip(stateName : String){
	chrAnimator.CrossFade(stateName, 0.05);
}


// when pressed jump button
function SetJump(){
    // when in ground.
    if(chrAnimator.GetInteger("Jump") == 0){
        // execute only when State tag is InIdle or InMove , moveDirection use jumpSpeed.
  		if(stateInfo.IsTag("InIdle") || stateInfo.IsTag("InMove")){
			chrAnimator.SetInteger("Jump", 1);
			moveDirection.y += jumpSpeed;
		}
	}
    // when in air, can jump once more.
	else if(chrAnimator.GetInteger("Jump") == 1){
        // jump with half power
		moveDirection.y += jumpSpeed /2;
		if(chrController.velocity.y < 0){
			moveDirection.y -= chrController.velocity.y;
		}
		chrAnimator.SetInteger("Jump", 2);
	}
}


// read 3D model information.
// vertex count, triangles, and joint of character and weapon.
// this function is called from GUIControl.
function GetMeshData(){
	var verts : int[] = new int[2]; // vertex.
	var tris : int[] = new int[2]; // triangle.
	var bones : int[] = new int[2]; // joint.
	var mdlInfo : String = "  " + gameObject.name; // text.
	for(var i = 0; i < meshData.Length; i++){
		var skinnedMeshData : SkinnedMeshRenderer = meshData[i].GetComponent(SkinnedMeshRenderer);
        // skinned model.
		if(skinnedMeshData){
			verts[i] = skinnedMeshData.sharedMesh.vertices.Length;
			tris[i] = skinnedMeshData.sharedMesh.triangles.Length / 3;
			bones[i] = skinnedMeshData.bones.Length;
			mdlInfo += "\nVertex : " + verts[i].ToString();
			mdlInfo += " ,  Tris : " + tris[i].ToString();
			mdlInfo += " ,  Bones : " + bones[i].ToString();
		}
        // mesh only.
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


// change shader
// this function is called from GUIControl.
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


// change Color of material
// this function is called from GUIControl.
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

