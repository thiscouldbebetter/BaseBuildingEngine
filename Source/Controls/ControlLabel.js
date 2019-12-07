
function ControlLabel(name, text)
{
	this.name = name;
	this._text = text;
}

{
	ControlLabel.prototype.text = function()
	{
		return this._text.get();
	}

	ControlLabel.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("label");
		}

		this._domElement.innerHTML = this.text();

		return this._domElement;
	}
}
