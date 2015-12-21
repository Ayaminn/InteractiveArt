using UnityEngine;
using System.IO;
using System.Collections;
using System.Collections.Generic;

public class BlueManager : MonoBehaviour {
    public int bpm;
    public List<int> scoreData = new List<int>();
    
	// Use this for initialization
    
	void Awake () {
        TextAsset csv = Resources.Load("csv/blue") as TextAsset; // データの読み込み
        StringReader reader = new StringReader(csv.text);

        bpm = int.Parse(reader.ReadLine()); // bpmの読み込み
        while (reader.Peek() > -1) {
            string line = reader.ReadLine(); // 1行ずつ読み込む
            for (int i = 0; i < line.Length - 1; i++) {
                scoreData.Add(int.Parse(line[i].ToString())); // 1文字ずつ数字(0, 1)に変換
            }
        }
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
