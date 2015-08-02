#pragma strict
var target: GUIText;
 
// 起動時にFogeと表示
function Start(){
    target.text = "Foge";
}
 
// ボタンのUI表示とボタンがクリックされたらJSのイベント発火
function OnGUI () {
    if(GUI.Button(Rect (10, 10, 150, 100), "JSでテキスト表示")) {
        Application.ExternalCall("alertUnityObject", target.text);
    }
}
 
// JSからUnity内でイベント発火
function UpdateTarget(str: String){
    target.text = str;
}