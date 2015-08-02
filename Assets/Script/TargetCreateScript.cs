using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class TargetCreateScript : MonoBehaviour {
	public GameObject[] spawners;

	public GameObject maru;
	public GameObject batu;

	private float maruWaitingTime = 4.0f;
	private float batuWaitingTime = 17.0f;

	// Use this for initialization
	void Start () {
		InvokeRepeating ("CreateMaru", maruWaitingTime, maruWaitingTime);
		InvokeRepeating ("CreateBatu", batuWaitingTime, batuWaitingTime);
	}
	
	// Update is called once per frame
	void Update () {

	}

	void CreateMaru (){
		//float x = -10;
		//float y = Random.Range(-7.5f, 7.5f);
		//float z = -1;

		int index = Random.Range (0, 2);

		//オブジェクトを生産
		Instantiate(maru, spawners[index].transform.position, Quaternion.identity);
	}
	void CreateBatu (){
		int index = Random.Range (0, 2);

		//オブジェクトを生産
		Instantiate(batu, spawners[index].transform.position, Quaternion.identity);
	}
}
