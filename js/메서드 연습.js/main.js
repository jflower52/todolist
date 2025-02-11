// 1. 주어진 숫자 배열에서 짝수만 필터링하여 새로운 배열을 만드세요.
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// ✅ TODO: 짝수만 필터링하는 코드 작성
const newNumbers = numbers.filter((item, index) => item % 2 === 0);
console.log(newNumbers);

// 2. 사람들의 나이가 담긴 배열에서 성인(18세 이상)만 필터링하세요.
const ages = [12, 18, 22, 16, 30, 25, 15];
// ✅ TODO: 18세 이상만 필터링하는 코드 작성
const newAges = ages.filter((item, index) => item >= 18);
console.log(newAges);

// 3. 주어진 문자열 배열에서 모든 단어를 대문자로 변환하는 배열을 만드세요.
const words = ["apple", "banana", "cherry"];
const newWords = words.map((words) => words.toUpperCase());
console.log(newWords);

// ✅ TODO: 모든 단어를 대문자로 변환하는 코드 작성

// 4. 상품 가격이 담긴 배열에서 모든 가격을 10% 할인한 새로운 배열을 만드세요.
const prices = [10000, 25000, 30000, 15000];
const newPrices = prices.map((item, index) => (item *= 0.9));
console.log(newPrices);
// ✅ TODO: 모든 가격을 10% 할인한 배열 반환

// 5. 배열의 값 두배 만들기
const numbers2 = [1, 2, 3, 4, 5];
const newNumbers2 = numbers2.map((numbers2) => numbers2 * 2);
console.log(newNumbers2);

//6. 알파벳 a가 포함된 단어를 제외한 단어 배열 만들기
const words2 = ["apple", "banana", "cherry", "grape", "melon"];
const newWords2 = words2.filter((item, index) => !item.includes("a"));
console.log(newWords2);
