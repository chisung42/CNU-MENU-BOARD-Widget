// 1. GitHub의 raw 링크를 사용하여 외부 코드 불러오기
const rawUrl = "https://raw.githubusercontent.com/username/repository/branch/yourScript.js"; // 실제 URL로 변경
const req = new Request(rawUrl);
const codeString = await req.loadString();
console.log("불러온 코드 길이:", codeString.length);

// 2. AsyncFunction 생성자로 외부 코드를 비동기 함수로 변환
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const runExternalCode = new AsyncFunction(codeString);

// 3. 외부 코드 실행 (내부에 await가 있어도 정상 작동)
try {
  await runExternalCode();
  console.log("외부 코드 실행 완료");
} catch (err) {
  console.error("외부 코드 실행 중 오류 발생:", err);
}
