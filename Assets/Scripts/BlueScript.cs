using UnityEngine;
using System.Collections;

public class BlueScript : MonoBehaviour {

	public float timeleft;
	public GameObject Blue;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;

        if (timeleft <= -1f) {
            timeleft = 0f;
            Instantiate(Blue, new Vector3(10, 110, 1.1f), Quaternion.identity);
        }
	}
}