 
function ControlButton(name, pos, size, text, click, context, colorBack)
{
	this.name = name;
	this.pos = pos;	
	this.size = size;
	this.text = text;	
	this.click = click;
	this.context = context;
	this.colorBack = colorBack;
}

{
	ControlButton.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlButton.prototype.draw = function(display)
	{
		var posAbsolute = this.posAbsolute();
 
		display.drawRectangle
		(
			posAbsolute, 
			this.size, 
			display.colorFore,
			this.colorBack
		);
 
		display.drawTextAtPos
		(
			this.text,
			posAbsolute
		);
	}
 
	ControlButton.prototype.mouseClick = function(mouseClickPosAbsolute)
	{
		if (this.containsPos(mouseClickPosAbsolute) == true)
		{
			this.click(this);
		}
	}
 
	ControlButton.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
}
