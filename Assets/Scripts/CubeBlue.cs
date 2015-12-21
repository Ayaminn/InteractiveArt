using UnityEngine;
using System.Collections;

public class CubeBlue : Photon.MonoBehaviour {
	
	public ParticleSystem par;
	public PhotonView myPV ;
	public GameObject BlueHantei;
	public GameObject Onpu;
	public Camera cameran;
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
       		Ray ray = cameran.ScreenPointToRay(Input.mousePosition);
       		RaycastHit hit = new RaycastHit();
        	if (Physics.Raycast(ray, out hit)){
            	GameObject obj = hit.collider.gameObject;
           		if(obj == BlueHantei || obj == Onpu){
           			Debug.Log("ll");
				Destroy(other.gameObject);
			//HanabiFlag = true;
					myPV.RPC("hanabi",PhotonTargets.All);
           		}
       		}
		
		}
	}
	
	// Update is called once per frame
	void Update () {
		//		if(HanabiFlag == true){
		
		//			par.Play();
		//			HanabiFlag = false;
		//		}
		
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
