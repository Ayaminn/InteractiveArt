using UnityEngine;
using System.Collections;

public class Ball : MonoBehaviour {

	private float timeleft = 1;
	//public float life_time = 1.5f;
    //float time = 0f;

	// Use this for initialization
	void Start () {
		//time = 0;
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;
		if (timeleft <=  0.0f) {
			timeleft = 1.0f;
			transform.position += new Vector3 (0, -0.3f * Time.deltaTime, 0);
		}

		if (gameObject.transform.position.y <= 50){
			//Destroy(gameObject);
		}
	}
}
