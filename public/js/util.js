define('util', function() {
    return {
        getInputsForm : function (text) {
            // get all the inputs into an array.
            var $inputs = $(text+' :input');

            // not sure if you wanted this, but I thought I'd add it.
            // get an associative array of just the values.
            var values = {};
            $inputs.each(function() {
                values[this.name] = $(this).val();
            });
            return values;
        },
        recollir : function(id) {
            var values = this.getInputsForm(id);
            var boxes = $('input[name=tematica]:checked');

            // Step-2
            // make an array of the values of all the checkboxes
            var tematica = [];       // variable boxesValue initialization as array
            $(boxes).each(function(){
                // push the element into array
                tematica.push(this.value);    // remember to push value here
            });

            // Step-3
            // convert array to string using join
            values.tematica = tematica.join(",");
            return values;
        },
        checkValues: function (values) {
            var missatgeError = {};
            for(var key in values) {
                var value = values[key];
                if(key=="files[]") {}
                else if(key==="tematica" && value.length==0) {
                    missatgeError[key]="Has de seleccionar alguna temàtica";
                }
                else if(key!=="public" && value.length==0) {
                    missatgeError[key]="El camp "+key+" no pot estar buit";
                }
            }
            delete missatgeError[""]; //a vegades queda una clau buida amb el nom del boto
            return missatgeError;
        },
        showErrors: function(element, objecte) {
            var el = $('strong.missatge-error');//Per consens sempre es mostren les errades a: strong.missatge-error
            el.empty();
            for(var key in objecte) {
                var value = objecte[key];
                el.append(value+"<br>");
            }
        },
        removeErrors: function () {
            var el = $('strong.missatge-error');
            el.empty();
        }
    };
});
