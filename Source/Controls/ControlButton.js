
function ControlButton(name, size, text, click, context, colorBack)
{
	this.name = name;
	this.size = size;
	this._text = text;
	this.click = click;
	this.context = context;
	this.colorBack = colorBack;
}

{
	ControlButton.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("button");
			this._domElement.style.backgroundColor = this.colorBack;
			if (this.size != null)
			{
				this._domElement.style.width = this.size.x + "px";
				this._domElement.style.height = this.size.y + "px";
			}
			this._domElement.onclick = this.click;
			this._domElement.value = this.context;
		}

		this._domElement.innerHTML = this.text();

		return this._domElement;
	}

	ControlButton.prototype.text = function()
	{
		return this._text.get();
	}
}
