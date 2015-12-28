using UnityEngine;
using System.Collections;

public class mainred : Photon.MonoBehaviour {

	public ParticleSystem par;
	public PhotonView myPV ;
	public GameObject RedHantei;
	public GameObject Onpu;
	bool HanabiFlag = false;

	// Use this for initialization
	void Start () {

	}

	void OnTriggerStay(Collider other){
		if (Input.GetMouseButtonDown(0)) {
       		Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
       		RaycastHit hit = new RaycastHit();
 
        	if (Physics.Raycast(ray, out hit)){
            	GameObject obj = hit.collider.gameObject;

           		if(obj == RedHantei || obj == Onpu){
           			Debug.Log("ll");
					Destroy(other.gameObject);
					myPV.RPC("hanabi",PhotonTargets.All);
           		}
        	}
    	}
	}

	// Update is called once per frame
	void Update () {

	}

	[RPC]

	void hanabi(){
		par.Play();
	}
}
