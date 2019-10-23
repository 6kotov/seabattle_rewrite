/*
:copyright: (c) tretyak@gmail.com
:license: MIT
 */
export const $$ = {
    last_unique_id: null,
    unique_id(base_id) {
        base_id = $$.is_defined(base_id) ? base_id + "_" : "";
        let random_str = "" + Math.random(),
            random_id = "" + base_id + random_str.substring(2, 12);
        this.last_unique_id = random_id;
        return random_id;
    },

    get_random_as_sting () {
        return ("" + Math.random()).replace(/\./g, '');
    },

    is_defined(value) {
        return typeof(value) !== 'undefined' && value !== null
    },
    is_valuable(value) {
        return typeof(value) !== 'undefined' && value !== null && value !== ""
    },
    to_lower(value) {
        return $$.is_string(value) ? value.toLowerCase() : "";
    },
    to_upper: function(value) {
         if ($$.is_string(value)) {
             return value.toUpperCase();
         }
         return ""
    },
    is_true : function (value) {
        var val;
        if($$.is_defined(value)) {
            if ($$.is_string(value)) {
                val = value.toUpperCase();
                if (val === 'Y' || val === 'YES' || val === 'TRUE') {
                    return true
                }
            }
            else {
                val = Number(value);
                if(val) {
                    return val !== 0
                }
            }
        }
        return value === true;
    },
    random_int_interval: function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    random_int: function(max) {
        return $$.random_int_interval(0, max);
    },
    random_array: function(input_array, items_count) {
        var result = [],
            current_length = input_array.length,
            temp_array = input_array.slice(0);

        items_count = $$.is_defined(items_count)
            && current_length > items_count
            ? items_count : current_length;

        for (var i=1; i<=current_length; i+=1) {
            var ind = $$.random_int(current_length-i);
            result.push(temp_array.splice(ind, 1)[0]);
        }
        return result;
    },
    get_dotted_value: function(key, dict) {
        if (! $$.is_object(dict)) {
            return dict
        }

        var idx = key.indexOf(".");
        if (idx === -1) {
            return dict[key];
        }
        var a = key.substring(0, idx),
            b = key.substring(idx + 1);

        return this.get_dotted_value(b, dict[a])
    },
    as_bool: function (value) {
        return "" + value === 'true'
    },
    is_string : function (value) {
        return (typeof value === 'string' && value.length > 0)
    },
    is_function : function (value) {
        return $$.is_defined(value) && (typeof value === 'function')
    },
    is_object : function (value) {
        return $$.is_defined(value) && (typeof value === 'object')
    },
    is_array: function(value) {
        return Array.isArray(value)
    },
    is_ArrayBuffer(value) {
        return value && value instanceof ArrayBuffer && value.byteLength !== undefined;
    },
    is_blob(value) {
        if ($$.is_defined(value) && $$.is_string(value)) {
            if ( value[0] === "b" && value[1] === "'") {
                return true
            }
        }
        return false
    },

    unpack_spec_char (ch) {
        let tab = {
            "'": 39,
            '"': 34,
            '\\': 92,
            "n": 10,
            "r": 13,
            "t": 9,
            "b": 8,
            "v": 11,
        }
        try {
            return tab[ch]
        }
        catch (e) {
            return 0
        }
    },
    text_to_uint_generator: function * (data, start) {
        for (let i = start; i < data.length-1;) {
            if (data[i] === '\\' && data[i + 1] === 'x') {
                let num = parseInt('0x' + data[i + 2] + data[i + 3])
                i += 4
                yield num
                continue
            }
            if (data[i] === '\\') {
                // console.log("XXX[" + data[i] + "] [" + data[i+1] + "] [" + $$.unpack_spec_char(data[i+1]) + "]")
                i += 2
                yield $$.unpack_spec_char(data[i - 1])
                continue
            }
            i += 1
            yield data.charCodeAt(i - 1)
        }

      },
    generator: function * (collection, condition, transform) {
        condition = $$.is_function(condition) ? condition : x => { return true }
        transform = $$.is_function(transform) ? transform : x => { return x }
        if ($$.is_defined(collection)) {
            for (let i=0; i<collection.length; i+=1) {
                let item = collection[i]
                if (condition(item)) {
                    yield transform(item)
                }
            }
        }
    },
    text_as_blob(data, start) {
        // parses string like "b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00'"
        return new Uint8Array($$.text_to_uint_generator(data, start))
    },

    includes: function(arr, value) {
      return $$.is_array(arr) ? arr.includes(value) : false
    },
    check_insert(arr1, arr2) {
        // insert all items from arr1 to arr2 checking if them are't in arr1
        if ($$.is_defined(arr2)) {
            if ($$.is_array(arr1)) {
                arr2 = $$.is_array(arr2) ? arr2 : [arr2]
                arr2.forEach(item => {
                    if (!$$.includes(arr1, item)) {
                        arr1.push(item)
                    }
                })
            }
        }
        return arr1
    },

    index_of: function(arr, value) {
      return $$.is_array(arr) ? arr.indexOf(value) : -1
    },
    shift_element: function(arr, element_index, relative_position) {
      if ( relative_position === 0
          || (arr.length <= element_index + relative_position)
          || (0 > element_index + relative_position)) {
        return arr
      }

      var value = arr[element_index],
          before = arr.slice(0, element_index),
          after = arr.slice(element_index+1, arr.length),
          v = null,
          tmp = null;

      if (relative_position > 0) {
          v = after.shift();
          tmp = before.concat();
          tmp.push(v);
          tmp.push(value);
          return tmp.concat(after)
      }
      else {
        v = before.pop();
        before.push(value);
        before.push(v);
        return before.concat(after);
      }
    },

    object_keys(obj) {
        return $$.is_object(obj) ? Object.keys(obj) : []
    },
    deep_copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    update_object(destination, source) {
        return $$.clone_object(destination, source);
    },
    merge_objects(destination, source) {
        return $$.clone_object(destination, source);
    },
    clone_object(destination, source, required_fields, except_fields_list) {
        except_fields_list = $$.is_array(except_fields_list) ? except_fields_list : [];
        for (const field in source) {
            if ((! $$.is_defined(required_fields) || $$.includes(required_fields, field))
                && ! $$.includes(except_fields_list, field)) {
                if (! $$.is_defined(source[field])) {
                    continue
                }
                // console.log("FIELD [" + field + "]", source[field]);
                if ($$.is_object(source[field])) {
                    destination[field] = destination[field] || {}
                    $$.clone_object(destination[field], source[field]);
                } else {
                    destination[field] = source[field];
                }
            }
        }
    },
    as_array : function(str, splitter) {
        let result = [];
        if ($$.is_string(str)) {
            const arr = str.split($$.is_string(splitter) ? splitter : " ");
            for (const i in arr) {
                result.push(arr[i].trim());
            }
        }
        return result;
    },
    contains_string: function(wrap_string, substring) {
        return $$.is_string(wrap_string) && wrap_string.indexOf(substring) !== -1
    },
    first_word: function(str) {
        var a = this.as_array(str, ",");
        return a ? a[0] : str;
    },

    last_char : function (str) {
        return $$.is_string(str) ? str[str.length-1] : undefined;
    },
    first_char : function (str) {
        return $$.is_string(str) ? str[0] : undefined;
    },
    first_chars : function(val, count, safed) {
        val =  $$.is_defined(safed) ? val : "" + val;
        return val.slice(0, count)
    },
    startswith(whole_str, val) {
        return $$.first_chars(whole_str, val.length) === val
    },
    last_chars : function(val, count, safed) {
        val =  $$.is_defined(safed) ? val : "" + val;
        // val = "" + val;
        return val.slice(-count)
    },
    skip_first_char : function (str) {
        return str.substr(1, str.length);
    },
    skip_last_digit_from_name : function (str) {
        var ch = $$.last_char(str);
        return ch >= '0' && ch <= '9' ? str.substr(0, str.length-1) : str;
    },
    all_blanks_replace(val_str) {
        return val_str.replace(/\s/g, '_')
    },
    is_last_char_01 : function (name) {
        var ch = $$.last_char(name);
        return ch === '0' || ch === '1' ? ch : -1;
    },
    join_url : function(prefix, suffix) {
        prefix = $$.last_char(prefix)  === '/' ? prefix : prefix + "/";
        suffix = $$.first_char(suffix) === '/' ? $$.skip_first_char(suffix) : suffix;
        return prefix + suffix;
    },

    join_array: function(arr, separator) {
        return arr.join(separator)
    },

    filtered_fields: function(obj, interesting_fields) {
        var result = {};
        for (var i=0; i<interesting_fields.length; i+=1) {
            var field_name = interesting_fields[i];
            if ($$.is_defined(obj[field_name])) {
                result[field_name] = obj[field_name]
            }
        }
        return result
    },

    trim: function(str) {
        return this.is_defined(str) ? str.replace(/^\s+|\s+$/g, '') : '';
    },
    normalise_url: function(str) {
         return this.is_defined(str) ? str.replace(new RegExp("/{2,}",'g'),"/") : '';

    },
    replace_word: function(str, source_word, target_word) {
         return this.is_defined(str) ? str.replace(new RegExp(source_word,'g'), target_word) : '';

    },
    first_not: function(str, ch) {
        if ($$.is_string(str)) {
            var size = str.length -1;
            for (var i = 0; i < size; ++i) {
                if (str[i] !== ch) {
                    return i
                }
            }
        }
        return -1
    },
    last_not: function(str, ch) {
        if ($$.is_string(str)) {
            var size = str.length -1;
            for (var i = size; i >= 0; --i) {
                if (str[i] !== ch) {
                    return i
                }
            }
        }
        return -1
    },
    is_multi_line_string: function(text) {
            return /[\r\n]/.exec(text);
    },

    now() {
        return Date.now()
    },
    array_intersection(arr1, arr2) {
        return arr1.filter(function (n) {
            return arr2.indexOf(n) > -1;
        });
    },
    object_attr(obj, attr_name, default_value) {
        if ($$.is_object(obj)) {
            if ($$.is_defined(obj[attr_name])) {
                return obj[attr_name]
            }
        }
        return default_value
    },
    safe_get(obj, params, default_value) {
        if (! $$.is_object(obj)) {
            return this.is_defined(default_value) ? default_value : obj
        }
        let name = params.shift();

        if (params.length > 0) {
            return $$.safe_get(obj[name], params)
        }
        return obj[name]
    },
    safe_set(obj, params, value) {
        let name = params.shift(),
            size = params.length

        if (! $$.is_defined(obj[name])) {
            obj[name] = size > 0 ? {} : value
        }
        return size > 0 ? $$.safe_set(obj[name], params, value) : obj;
    },
    unicode_normalize(value) {
        if ($$.is_string(value) && $$.like_json(value)) {
            let r = /\\u([\d\w]{4})/gi;
            value = value.replace(r, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16));
            });
            return decodeURIComponent(value)
        }
        return value
    },
    json_as_object(json_str) {
        return JSON.parse(json_str)
    },
    like_json(json_str) {
        let f =  $$.first_char(json_str),
            l = $$.last_char(json_str)
        return f === '{' && l === '}' || f === '[' && l === ']'
    },
    like_url(str) {
        if ($$.is_string(str)) {
            return $$.first_chars(str, 4, "checked") === 'www.'
                || $$.first_chars(str, 7, "checked") === 'http://'
                || $$.first_chars(str, 8, "checked") === 'https://'
        }
        return false
    }
}
