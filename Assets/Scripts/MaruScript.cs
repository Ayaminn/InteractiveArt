using UnityEngine;
using System.Collections;

public class MaruScript : MonoBehaviour {

	public GameObject Prefab;
	public GameObject Maru;

	void Start () {
		Maru = this.gameObject;
	}

	void Update () {
		transform.position += new Vector3 (-0.1f, 0.0f, 0.0f);
	}

	void OnCollisionEnter(Collision collision){
		
		if (collision.gameObject.tag == "ball") {
			Destroy (collision.gameObject);
			Destroy (Maru);
		}

		Instantiate (Prefab, collision.contacts[0].point +new Vector3 (1, 2, 0), Prefab.transform.rotation);
	}
}
