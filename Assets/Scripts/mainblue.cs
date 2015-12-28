using UnityEngine;
using System.Collections;

public class mainblue : Photon.MonoBehaviour {
	
	public ParticleSystem parred;
	public ParticleSystem paryellow;
	public ParticleSystem parblue;
	public ParticleSystem pargreen;
	public PhotonView myPV;
	public GameObject BlueHantei;
	public GameObject Onpu;
	public Camera cameran;
	bool HanabiFlag = false;
	public int score = 0;
	public GameObject pink;
	public GameObject blue;
	public GameObject yellow;
	public float ram;
	
	// Use this for initialization
	void Start () {
		
	}
	void OnTriggerStay(Collider other){
		
		if (Input.GetMouseButtonDown(0)) {
       		Ray ray = cameran.ScreenPointToRay(Input.mousePosition);
       		RaycastHit hit = new RaycastHit();

        	if (Physics.Raycast(ray, out hit)){
            	GameObject obj = hit.collider.gameObject;

           		if(obj == BlueHantei || obj == Onpu){
					score++;
           			Debug.Log("Good!");
					Destroy(other.gameObject);
					myPV.RPC("hanabi",PhotonTargets.All);
           		}
       		}
		}
	}
	
	// Update is called once per frame
	void Update () {
		if(score == 5){
			blue.SetActive (false);
			pink.SetActive (false);
			yellow.SetActive (true);
		}else if(score == 15){
			blue.SetActive (true);
			pink.SetActive (false);
			yellow.SetActive (false);
		}else if(score == 30){
			blue.SetActive (false);
			pink.SetActive (true);
			yellow.SetActive (false);
		}else if(score == 45){
			blue.SetActive (true);
			pink.SetActive (false);
			yellow.SetActive (true);
		}else if(score == 60){
			blue.SetActive (true);
			pink.SetActive (true);
			yellow.SetActive (true);
		}
	}

	[RPC]

	void hanabi(){
		ram = Random.Range (7, 40);
		if(score % 3 == 0){
			paryellow.transform.position = new Vector3 (ram, 10f, -20f);
			paryellow.Play();
		}
	}
}
