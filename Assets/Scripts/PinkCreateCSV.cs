using UnityEngine;
using System.Collections;

public class PinkCreateCSV : MonoBehaviour {
    private float timer = 0f;
    private RedManager redManager;
    private GameObject csvLoader;
    private int scoreNum = 0; // 現在読み込んでいる譜面の個数
    public GameObject musicball;

	// Use this for initialization
	void Start () {
        csvLoader = GameObject.Find("RedManager");
        redManager = csvLoader.GetComponent<RedManager>(); // LoadScoreData.csを取得
	}
	
	// Update is called once per frame
 	void Update () {
        if (Time.time > (15f / redManager.bpm) * scoreNum && scoreNum < redManager.scoreData.Count) {
            if (redManager.scoreData[scoreNum] == 1) {
               Instantiate(musicball, new Vector3(0, 115, 1.1f), Quaternion.identity); // 
            }
            scoreNum++;
        }
	}
}
