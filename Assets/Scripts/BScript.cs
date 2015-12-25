using UnityEngine;
using System.Collections;

public class BScript : MonoBehaviour {

	private float time_;

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		time_ -= Time.deltaTime;

		if (time_ <= 0.0f) {
			time_ = 1.0f;
			transform.position += new Vector3 (0, -0.3f * Time.deltaTime, 0);
		}
	}
}
