
function ControlLabel(name, text)
{
	this.name = name;
	this.text = text;
}

{
	ControlLabel.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("label");
			this._domElement.innerHTML = this.text;
		}

		return this._domElement;
	}
}
