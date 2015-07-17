using UnityEngine;
using System.Collections;

public class KabeScript : MonoBehaviour {
	public GameObject Prefab;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnCollisionEnter(Collision collision){
		//Debug.Log("あたった");
		Instantiate (Prefab, collision.contacts[0].point, Prefab.transform.rotation);

		if(collision.gameObject.tag == "ball"){
			Destroy (collision.gameObject);
		}
	}
}
