using UnityEngine;
using System.Collections;

public class BallCreate : MonoBehaviour {


	public float timeleft;

	public GameObject[] ball66;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;
        	if (timeleft <= 0f) {
            	timeleft = 10f;
        	}
	}
}
