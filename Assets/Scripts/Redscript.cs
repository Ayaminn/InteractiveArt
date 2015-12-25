using UnityEngine;
using System.Collections;

public class Redscript : MonoBehaviour {

	public float timeleft;
	public GameObject Red;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;

        if (timeleft <= -1f) {
            timeleft = 0f;
            Instantiate(Red, new Vector3(0, 110, 1.1f), Quaternion.identity);
        }
	}
}