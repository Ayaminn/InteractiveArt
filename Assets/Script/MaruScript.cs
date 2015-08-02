using UnityEngine;
using System.Collections;

public class MaruScript : MonoBehaviour {

	public GameObject Prefab;
	public GameObject Maru;

	//private int score;

	void Start () {
		Maru = this.gameObject;
	}
	// ilILoOabcdefgj
	// Update is called once per frame
	void Update () {
		transform.position += new Vector3 (0.1f, 0.0f, 0.0f);
	}

	void OnCollisionEnter(Collision collision){
		if (collision.gameObject.tag == "ball") {
			//Debug.Log ("ぼーる");
			//Destroy (gameObject);
			//花火生成
			//Instantiate (Prefab, collision.contacts[0].point, Prefab.transform.rotation);

			Destroy (collision.gameObject);
			Destroy (Maru);
			// Destroy (this);
		}
		Instantiate (Prefab, collision.contacts[0].point +new Vector3 (1, 2, 0), Prefab.transform.rotation);
	}
}
