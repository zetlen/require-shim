describe('In-browser, dynamic requirements shimming',function(){

    it('should export a value from a noncompliant script', function(){

        var fnRef = false;

        require(['shim!noncompliantscript>returnsPresent'], function(fn){
            fnRef = fn;
        });

        waitsFor(function() {
            return !!fnRef;
        });

        runs(function(){
            expect(fnRef()).toEqual('present');
        });
    });

    it('should inject a dependency before loading the shimmed script', function(){

        var fnRef = false;

        require(['shim!jquery-ui[jquery=jQuery]','jquery'], function(_,fn){
            fnRef = fn;
        });

        waitsFor(function() {
            return !!fnRef;
        });

        runs(function(){
            expect(fnRef.fn.jquery).toBeDefined();
            expect(fnRef.ui).toBeDefined();
        });

    });

    it('should nest dependencies successfully', function() {

        var fnRef = false;

        require(['shim!workflow[shim!backbone-min[shim!underscore-min>_=_]>Backbone=Backbone]>Backbone'], function(BB){
            fnRef = BB;
        });

        waitsFor(function(){
            return !!fnRef;
        });

        runs(function() {
            expect(fnRef).toBe(Backbone);
            expect(fnRef.Workflow).toBeDefined();
        });
    });

    // it('should throw an exception trying to export a nonexistent value', function(){
    //     expect(function() { 
    //         var fnRef = false;

    //         require(['shim!compliantscript>nonexistentValue']); }).toThrowExceptionMatching(/derp/);
    // });
});