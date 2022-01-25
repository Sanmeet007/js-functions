function $(element) {
  if (document.querySelectorAll(element).length === 1) {
    return document.querySelector(element);
  } else {
    return document.querySelectorAll(element);
  }
}

function formatBytes(bytes, decimals = 0) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0: decimals;
  const sizes = ['B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function beautifyDate(date , short = false) {
  date = new Date(date);
  if (date.toString() === "Invalid Date") {
    return "Invalid Date";
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDate = new Date();
  currentDate = currentDate.getDate() +" "+currentDate.getMonth() +" "+ currentDate.getFullYear();

  let  givenDate = date.getDate() +" "+ date.getMonth() +" "+ date.getFullYear();

  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  yesterdayDate = yesterdayDate.getDate() +" "+ yesterdayDate.getMonth() +" "+ yesterdayDate.getFullYear();

  if (currentDate === givenDate) {
    return "today";
  } else if (yesterdayDate === givenDate) {
    return  "yesterday";
  } else {
    let  month = date.getMonth();
    let year = date.getFullYear();
    let thisDate = date.getDate();
    month = months[month];
    if (thisDate < 10) {
      thisDate = "0"+ thisDate;
    }
    if (short) {
      month = month.substr(0, 3);
    }
    return thisDate +" "+month+" "+year;
  }
}

Array.prototype.getItemCount = function(item) {
  let counts = {};
  for (let i = 0; i < this.length; i++) {
    let num = this[i];
    counts[num] = counts[num] ? counts[num]+1: 1;
  }
  return counts[item] || 0;
};

Array.prototype.randomize = function (e) {
  return this.sort(() =>  0.5 - Math.random());
};

Array.prototype.removeAt = function (index) {
  let array = Array.from(this);
  delete array[index];
  return array;
};

Array.prototype.insert = function (value, index) {
  let array = Array.from(this);
  array[index] = value;
  return array;
};

String.prototype.template = function (obj) {
  let str = this;
  Object.keys(obj).forEach(key => {
    str = str.replace("{" +key+"}", obj[key]);
  });
  return str;
};


String.prototype.convertToURL = function () {
  const text = String(this);
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
};

String.prototype.insertCharacter = function (value, at) {
  let array = Array.from(this);
  array[at] = value;
  let str = array.reduce((acc, val) => acc += val, "");
  return str;
};

String.prototype.randomize = function() {
  let str = "";
  let array = [];
  for (var i = 0; i < this.length; i++) {
    array.push(this[i]);
  }
  array.sort(() =>  0.5 - Math.random());
  array.forEach(word => {
    str += word;
  });
  return str;
};

Math.randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};


document.ajax = function (obj) {
  if (obj.beforeSend !== undefined) {
    obj.beforeSend();
  }

  if (obj.sync === undefined) {
    obj.sync = false;
  }
  if (obj.type === undefined) {
    obj.type = "GET";
  }
  if (obj.url === undefined) {
    if (obj.error !== undefined) {
      obj.error("URL can't be undefined");
    }
    return null;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open(obj.type, obj.url, !obj.sync);

  let array_string = "";
  let length = 0;

  if (obj.data !== undefined) {

    const data_arr = Object.entries(obj.data);


    for (var prop in data_arr) {

      array_string += data_arr[prop][0] + "=" + data_arr[prop][1] + "&";
    }

    length = array_string.length - 1;
    array_string = array_string.substring(0, length);
  }

  if (obj.type === "GET") {
    if (array_string !== "") {
      xhttp.send(array_string);
    } else {
      xhttp.send();
    }

  } else if (obj.type === "POST") {
    if (array_string === "") {
      console.error("data object can't be empty");
      if (obj.error !== undefined) {
        obj.error("data object can't be empty");
      }

    } else {
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(array_string);
    }
  } else {
    if (obj.error !== undefined) {
      obj.error('Invalid object key type ');
    }
  }

  xhttp.onreadystatechange = function() {

    if (this.readyState === 4 && this.status !== 200) {
      obj.error("xhttp call failed with an error status of " +this.status);
    }

    if (this.readyState === 4 && this.status === 200) {
      if (obj.success !== undefined) {
        obj.success(this.response, "success");
      }
    }
  };
  try {
    xhttp.onprogress = function(e) {
      if (obj.progress !== undefined) {
        obj.progress(e);
      }
    };
  }catch (error) {
    obj.error(error);
  }
  xhttp.onerror = function(e) {
    obj.error(e);
  };
};