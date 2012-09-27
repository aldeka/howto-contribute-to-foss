$(document).ready(function(){
    var init,
        activeStepNum,
        updateActiveStep,
        getStepNumber,
        getStepID,
        canHazLocalStorage;
    
    init = function() {
        console.log("I'm alive!");
        canHazLocalStorage = supports_html5_storage();
        activeStepNum = 1;
        
        if (canHazLocalStorage){
            console.log('HTML 5 storage is go');
            // default is 1; tries to get value out of storage if there is one
            updateActiveStep((parseInt(localStorage.fossContribGuideStep) || 1) - 1);
        } else {
            updateActiveStep(0);
        }
    };
    
    $('.checkbox-clickable').live('click', function(e) {
        var id;
        e.preventDefault();
        
        $(this).toggleClass('checked');
        if ($(this).hasClass('checked')) { 
            $(this).closest('li').addClass('completed-step');
            updateActiveStep(1); 
        } else { 
            $(this).closest('li').removeClass('completed-step');
            id = $(this).closest('li').attr('id');
            updateActiveStep((activeStepNum - getStepNumber(id)) * -1); 
        }
    });
    
    updateActiveStep = function(stepCount) {
        // stepCount will usually be 1
        // to go backwards, stepCount can be negative
        var oldStep,
            newStep,
            oldActiveStepNum;
        
        // console.log(activeStepNum);
        
        oldStep = $('.active-step');
        $(oldStep).removeClass('active-step');
        
        oldActiveStepNum = activeStepNum;
        activeStepNum = activeStepNum + stepCount;
        
        // handler for fixing multiple steps
        if (oldActiveStepNum > activeStepNum) {
            // going backward
            while (oldActiveStepNum != activeStepNum) {
                $('#' + getStepID(oldActiveStepNum))
                    .removeClass('completed-step')
                    .find('.checkbox')
                    .removeClass('checked')
                    .removeClass('checkbox-clickable');
                    
                oldActiveStepNum--;
            }
        } else {
            // going forward
            while (oldActiveStepNum != activeStepNum) {
                $('#' + getStepID(oldActiveStepNum))
                    .addClass('completed-step')
                    .find('.checkbox')
                    .addClass('checkbox-clickable')
                    .addClass('checked');
                    
                oldActiveStepNum++;
            }
        }
        
        // console.log(activeStepNum);

        newStep = $('#' + getStepID(activeStepNum));

        $(newStep)
            .addClass('active-step')
            .find('.checkbox')
            .removeClass('.checked')
            .addClass('checkbox-clickable');
            
        if (canHazLocalStorage) {
            localStorage.fossContribGuideStep = activeStepNum;
            console.log(localStorage.fossContribGuideStep);
        }
    };
    
    getStepID = function(num) {
        return 'step-' + num;
    };
    
    getStepNumber = function(id) {
        // ids are 'step-*'
        return parseInt(id.slice(5));
    };

    init();
});

var supports_html5_storage = function() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}