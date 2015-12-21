using UnityEngine;
using System.Collections;

public class CubeRed : Photon.MonoBehaviour {

	public ParticleSystem par;
	public PhotonView myPV ;
	//bool stay = false;
	//private float timeleft = 0.5f;
	//bool click = false;
	public GameObject RedHantei;
	public GameObject Onpu;
	//public ParticleSystem part;
	
	//public GameObject Hanabi;
	bool HanabiFlag = false;

	// Use this for initialization
	void Start () {

	}
	void OnTriggerStay(Collider other){
		//stay = true;
		//if(Input.GetKey(KeyCode.Space)){
		if (Input.GetMouseButtonDown(0)) {
 
       		Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
       		RaycastHit hit = new RaycastHit();
 
        	if (Physics.Raycast(ray, out hit)){
            	GameObject obj = hit.collider.gameObject;
           		if(obj == RedHantei || obj == Onpu){
           			Debug.Log("ll");
			Destroy(other.gameObject);
			//HanabiFlag = true;
			myPV.RPC("hanabi",PhotonTargets.All);
           	}
        }
    }
	//	if (OnMouseOver()){
	//void OnMouseOver(tag == player){
//			Debug.Log("ll");
//			Destroy(other.gameObject);
			//HanabiFlag = true;
//			myPV.RPC("hanabi",PhotonTargets.All);
			//Instantiate(Hanabi, new Vector3(23.0f, 1.0f, 2.0f), Quaternion.identity);
			//par.Play();
			//Destroy(collision.gameObject);
		}
	
	//Input.GetMouseButtonDown(0)
	
	
	// Update is called once per frame
	void Update () {
/*		timeleft -= Time.deltaTime;
//		if(HanabiFlag == true){

//			par.Play();
//			HanabiFlag = false;
//		}
		if (stay == true){
			if (timeleft <= 0.0) {
            timeleft = 0.5f;
            	stay = false;
   	    	}
		} else if (click == true){

		}*/
	}
	[RPC]
	void hanabi(){
		//if(HanabiFlag == true){

			par.Play();
			//HanabiFlag = false;
		//}

	}

	/*private void OnCollisionEnter(Collision collision){
		Destroy(collision.gameObject);
	}
	*/
}
