function encrypt() {
  var plaintext = document.getElementById("plaintext").value;
  var key0 = document.getElementById("key0").value;
  var key1 = document.getElementById("key1").value;

  // Check if any required field is empty
  if (plaintext.trim() === "" || key0.trim() === "" || key1.trim() === "") {
    alert("Please fill in all required fields.");
    return;
  }

  // Check if plaintext is binary and has a length that is a multiple of 8
  if (/^[01]+$/.test(plaintext)) {
    if (plaintext.length % 8 !== 0) {
      alert("Binary plaintext length must be a multiple of 8.");
      return;
    }
  }

  var ciphertext;

  // Check if the input is binary or plaintext
  if (/^[01]+$/.test(plaintext)) {
    // If input is binary, directly encrypt it
    ciphertext = rc4Binary(plaintext, [parseInt(key0), parseInt(key1)]);
  } else {
    // If input is plaintext, convert it to binary and then encrypt
    var binaryText = textToBinary(plaintext);
    ciphertext = rc4Binary(binaryText, [parseInt(key0), parseInt(key1)]);
  }

  document.getElementById("ciphertext").value = ciphertext;
}

// Function to encrypt binary input
function rc4Binary(binaryText, key) {
  var plaintext = binaryToText(binaryText);
  return rc4(plaintext, key);
}

// Function to convert text to binary
function textToBinary(text) {
  return text.split('').map(function(char) {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
}

// Function to convert binary to text
function binaryToText(binaryText) {
  var binaryChunks = binaryText.match(/.{1,8}/g);
  return binaryChunks.map(function(chunk) {
    return String.fromCharCode(parseInt(chunk, 2));
  }).join('');
}

// Existing RC4 encryption function
function rc4(text, key) {
  var s = [0, 1, 2, 3]; // Initial S array
  var k = [key[0], key[1]]; // Keys from the User

  // Key Setup phase
  // Initial value
  var i = 0;
  var f = 0;
  var g = 0;

  // Generate the four iteration
  for (var z = 1; z < 5; z++) {
    f = (f + s[i] + k[g]) % 4;
    swap(s, i, f);
    i = i + 1;
    g = (g + 1) % 2;
  }

  // Ciphering phase
  var ciphertext = '';
  var i = 0;
  var f = 0;

  for (var x = 0; x < text.length; x++) {
    // Calculate i and f
    i = (i + 1) % 4;
    f = (f + s[i]) % 4;
    
    // Swap Si with Sf
    swap(s, i, f);

    // Calculate t
    var t = (s[i] + s[f]) % 4;
    
    // Perform XOR operation between plaintext character and s[t]
    var plaintextChar = parseInt(text.charCodeAt(x).toString(2), 2);
    var cipherChar = plaintextChar ^ s[t];
    
    // Convert cipherChar to binary and append it to ciphertext
    ciphertext += cipherChar.toString(2).padStart(8, '0');
  }

  return ciphertext;
}

// Function to swap elements in an array
function swap(arr, i, s) {
  var temp = arr[i];
  arr[i] = arr[s];
  arr[s] = temp;
}
