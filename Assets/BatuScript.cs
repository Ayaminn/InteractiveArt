using UnityEngine;
using System.Collections;

public class BatuScript : MonoBehaviour {

	public GameObject Prefab;
	private GameObject Batu;

	// Use this for initialization
	void Start () {
		Batu = this.gameObject;
	}

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
			Destroy (Batu);
		}
	}
}
