using UnityEngine;
using System.Collections;

public class BlueCreateCSV : MonoBehaviour {
    private float timer = 0f;
    private BlueManager blueManager;
    private GameObject csvLoader;
    private int scoreNum = 0; // 現在読み込んでいる譜面の個数
    public GameObject musicball;

	// Use this for initialization
	void Start () {
        csvLoader = GameObject.Find("BlueManager");
        blueManager = csvLoader.GetComponent<BlueManager>(); // LoadScoreData.csを取得
	}
	
	// Update is called once per frame
 	void Update () {
		
        if (Time.time > (15f / blueManager.bpm) * scoreNum && scoreNum < blueManager.scoreData.Count) {
			
            if (blueManager.scoreData[scoreNum] == 1) {
                Instantiate(musicball, new Vector3(-28.5f, 115, 1.1f), Quaternion.identity);
            }

            scoreNum++;
        }
	}
}
