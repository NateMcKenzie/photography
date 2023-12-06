from django import forms

class FileUploadForm(forms.Form):
    email = forms.CharField(max_length=255)
    file = forms.FileField()
