
function ControlBreak()
{
}

{
	ControlBreak.prototype.domElementUpdate = function()
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("br");
		}

		return this._domElement;
	}
}
