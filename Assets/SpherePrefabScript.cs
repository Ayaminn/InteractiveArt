using UnityEngine;
using System.Collections;

public class SpherePrefabScript : MonoBehaviour {

	public GameObject Prefab;
	// クリックした位置座標
	private Vector3 clickPosition;
	//public float a;

	// Use this for initialization
	void Start () {

	}

	// Update is called once per frame
	void Update () {

		//transform.position += new Vector3 (0, 0, a*Time.deltaTime);

		/*if (Input.GetKey(KeyCode.Space))
        {
            //GetComponent<Renderer>().enabled = false;
            Debug.Log("おされた");
            GetComponent<Rigidbody>().AddForce(new Vector3(0, 100, 100));
        }
        */
		// マウス入力で左クリックをした瞬間
		if (Input.GetMouseButtonDown(0)) {
			// ここでの注意点は座標の引数にVector2を渡すのではなく、Vector3を渡すことである。
			// Vector3でマウスがクリックした位置座標を取得する
			clickPosition = Input.mousePosition;
			// Z軸修正
			clickPosition.z = 3.0f;
			// オブジェクト生成 : オブジェクト(GameObject), 位置(Vector3), 角度(Quaternion)
			// ScreenToWorldPoint(位置(Vector3))：スクリーン座標をワールド座標に変換する
			Instantiate (Prefab, Camera.main.ScreenToWorldPoint (clickPosition), Prefab.transform.rotation);
		}
	}
}