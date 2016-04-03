using UnityEngine;
using System.Collections;

public class FireFlower : MonoBehaviour {

	private float timeleft;
	private float ramx;
	private float ramh;
	private float ramt;
	public GameObject pink;
	public GameObject blue;
	public GameObject green;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;
		ramh = Random.Range (1, 3);
		if (timeleft <= 0.0) {
			ramx = Random.Range (-6, 6);
			ramt = Random.Range (0.5f, 5);
//			blue.SetActive (false);
//			pink.SetActive (false);
//			green.SetActive (false);
			timeleft = ramt;
			if (ramh == 1) {
				Instantiate (green);
				green.transform.position = new Vector3 (ramx, 0, 0);
			} else if (ramh == 2) {
				Instantiate (pink);
				pink.transform.position = new Vector3 (ramx, 0, 0);
			} else if (ramh == 3) {
				Instantiate (blue);
				blue.transform.position = new Vector3 (ramx, 0, 0);
			}
		}
	}
}
